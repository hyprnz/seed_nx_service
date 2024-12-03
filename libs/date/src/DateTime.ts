import * as fns from 'date-fns';
import * as tz from 'date-fns-timezone';

export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
export const offsetFormat = 'Z';

export enum TimeZones {
    PacificAuckland = 'Pacific/Auckland',
    Utc = 'UTC'
}

export class DateTime {
    protected constructor(protected readonly date: Date, protected readonly microseconds: number = 0) {}

    static isDateTime(value: any): boolean {
        return value instanceof DateTime;
    }

    static now(date = new Date()): DateTime {
        // const nanoseconds = process.hrtime.bigint();
        // const microseconds = (nanoseconds % BigInt(1e6)) / BigInt(1e6);
        // const d = fns.format(date, `yyyy-MM-ddTHH:mm:ss.${microseconds.toString().substr(1, 6)}xxx`);
        const format = `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`;
        const d = fns.format(date, format);
        return DateTime.fromStringWithoutValidation(d);
    }

    static min(): DateTime {
        return new DateTime(new Date(-1000000000000));
    }

    static max(): DateTime {
        return new DateTime(new Date(10000000000000));
    }

    static parseStrict(value: any, timeZone: string = TimeZones.Utc): DateTime {
        const dateTime = DateTime.parse(value, timeZone);
        if (!dateTime) throw new Error(`Failed DateTime.parseStrict(${JSON.stringify(value)})`);
        return dateTime;
    }

    // Parse handles destructured objects which some frameworks convert DateTime to.
    static parse(value: any, timeZone: string = TimeZones.Utc): DateTime | undefined {
        try {
            if (DateTime.isDateTime(value)) {
                return value;
            } else if (isString(value)) {
                return DateTime.fromString(value, timeZone);
            } else if (isNumber(value)) {
                return DateTime.fromNumber(value);
            } else if (isDate(value)) {
                return DateTime.fromDate(value);
            } else if (value && value.date && fns.isValid(new Date(value.date)) && isNumber(value.microseconds)) {
                return value.microseconds === 0 && isString(value.date)
                    ? DateTime.fromString(value.date, timeZone)
                    : new DateTime(new Date(value.date), value.microseconds);
            } else {
                return undefined;
            }
        } catch {
            return undefined;
        }
    }

    static valid(value: any): boolean {
        return DateTime.parse(value) !== undefined;
    }

    static fromString(date: string, timeZone: string = TimeZones.Utc): DateTime {
        if (invalidDateString(date) || !fns.isValid(new Date(date))) {
            throw new Error(`Unable to parse date: ${date}`);
        }
        return DateTime.fromStringWithoutValidation(date, timeZone);
    }

    static fromStringWithoutValidation(date: string, timeZone: string = TimeZones.Utc): DateTime {
        const offset = getOffset(date);
        if (isString(offset)) {
            return new DateTime(new Date(date), makeMicroseconds(date));
        }

        // Date.UTC
        return new DateTime(new Date(tz.parseFromTimeZone(date, { timeZone })), makeMicroseconds(date));
    }

    static fromDate(date: Date): DateTime {
        if (!isDate(date)) throw new Error('Failed to create DateTime with invalid date');
        const milliseconds = date.getMilliseconds();
        return new DateTime(date, milliseconds > 0 ? milliseconds / 1000 : 0);
    }

    static fromNumber(ticks: number): DateTime {
        return DateTime.fromMillisecondTime(ticks);
    }

    static fromMicrosecondTime(time: number): DateTime {
        return new DateTime(new Date(Math.floor(time / 1000)), (time % 1000000) / 1000000);
    }

    static fromMillisecondTime(time: number): DateTime {
        return new DateTime(new Date(Math.floor(time)), (time % 1000) / 1000);
    }

    plusDays(days: number): DateTime {
        return new DateTime(fns.addDays(this.date, days), this.microseconds);
    }

    getMilliseconds(): number {
        return fns.getMilliseconds(this.date);
    }

    equals(other: this): boolean {
        return this.toMicrosecondTime() === other.toMicrosecondTime();
    }

    before(other: this): boolean {
        return this.toMicrosecondTime() < other.toMicrosecondTime();
    }

    after(other: this): boolean {
        return this.toMicrosecondTime() > other.toMicrosecondTime();
    }

    toNumber(): number {
        return this.date.getTime();
    }

    toEpochTime(): number {
        return Math.trunc(this.date.getTime() / 1000);
    }

    toMillisecondTime(): number {
        return this.date.getTime();
    }

    toMicrosecondTime(): number {
        return this.date.getTime() * 1000 + (Math.round(this.microseconds * 1000000) % 1000);
    }

    toDate(): Date {
        return this.date;
    }

    toUtcString(timeZone = TimeZones.PacificAuckland): string {
        return `${tz.formatToTimeZone(this.date, dateTimeFormat, { timeZone })}.${this.microseconds
            .toFixed(6)
            .toString()
            .substring(2, 8)}${tz.formatToTimeZone(this.date, offsetFormat, { timeZone })}`;
    }

    toString(timeZone = TimeZones.PacificAuckland): string {
        return this.toUtcString(timeZone);
    }

    toFormattedString(tokens: string, timeZone = TimeZones.PacificAuckland): string {
        return tz.formatToTimeZone(this.date, tokens, { timeZone }).toString();
    }

    plusHours(hours: number): DateTime {
        return new DateTime(fns.addHours(this.date, hours), this.microseconds);
    }

    plusMinutes(minutes: number): DateTime {
        return new DateTime(fns.addMinutes(this.date, minutes), this.microseconds);
    }

    plusSeconds(seconds: number): DateTime {
        return new DateTime(fns.addSeconds(this.date, seconds), this.microseconds);
    }

    plusMilliSeconds(milliSeconds: number): DateTime {
        return DateTime.fromMicrosecondTime(this.toMicrosecondTime() + milliSeconds * 1000);
    }

    plusMicroseconds(microseconds: number): DateTime {
        return DateTime.fromMicrosecondTime(this.toMicrosecondTime() + microseconds);
    }

    startOfDay(): DateTime {
        return new DateTime(fns.startOfDay(this.date), 0);
    }
}

export const dateTimeTimestamp = {
    from: (value: string): DateTime => orNull(DateTime.parse(value))!
};

const orNull = (date: DateTime | undefined): DateTime | null => {
    return isUndefinedOrNull(date) ? null : date!;
};

export const dateTimeTransformer = {
    // from has to handle undefined => null due to a typeorm problem (ask Gareth about it)
    from: (value: string): DateTime | null => {
        if (isUndefinedOrNull(value)) return null;
        const dateTime = DateTime.parse(value);
        if (!dateTime) throw new Error(`Failed dateTimeTransformer.from(${JSON.stringify(value)})`);
        return dateTime;
    },
    to: (value: any): string => {
        const dateTime = DateTime.parse(value);
        if (!dateTime) {
            throw new Error(`Failed dateTimeTransformer.to(${JSON.stringify(value)})`);
        }
        return dateTime.toUtcString();
    }
};

export const dateTimeTransformerWithNulls = {
    from: (value: string | null): DateTime | null => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return dateTimeTransformer.from(value!);
    },
    to: (value: any): string | null => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return dateTimeTransformer.to(value);
    }
};

export const dateTimeForNzZoneTransformer = {
    // from has to handle undefined => null due to a typeorm problem
    from: (value: string): DateTime | null => {
        const dateTime = DateTime.parse(value, TimeZones.PacificAuckland);
        if (!dateTime) {
            return null;
        }
        return dateTime;
    },
    to: (value: any): string => {
        const dateTime = DateTime.parse(value, TimeZones.PacificAuckland);
        if (!dateTime) {
            throw new Error(`Failed dateOnlyTransformer.to(${JSON.stringify(value)})`);
        }
        return dateTime.toUtcString();
    }
};

export const dateTimeForZoneTransformerWithNulls = {
    from: (value: string | null): DateTime | null => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return dateTimeForNzZoneTransformer.from(value!);
    },
    to: (value: any): string | null => {
        if (isUndefinedOrNull(value)) {
            return null;
        }
        return dateTimeForNzZoneTransformer.to(value);
    }
};

export const makeMicroseconds = (utcDate: string): number => {
    try {
        if (!isString(utcDate)) {
            return 0;
        }
        const parts = utcDate!.split('.');
        return parts.length > 1 ? toMicro(parts[1].split(/[+-]/)[0]) : 0;
    } catch (error: any) {
        console.error(error.message);
        throw new Error(`Unable to get microseconds from: ${utcDate}. Error was ${error.message}`);
    }
};

const invalidDateString = (date: string): boolean => {
    try {
        return !isString(date) || date.length === 0 || new Date(date).toString() === 'Invalid Date';
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
};

const toMicro = (s: string): number => {
    return isString(s) && s.length > 0 ? padToNumber(s.replace(/[zZ]/, '').substring(0, 6)) : 0;
};

const padToNumber = (aNumber: string): number => {
    return Number('0.' + aNumber);
};

// Keep these local to avoid dependencies when packaging.
const isString = (s: any): boolean => {
    return typeof s === 'string';
};

const isDate = (d: any): boolean => {
    return d instanceof Date && fns.isValid(d);
};

export const isUndefinedOrNull = (value: any) => {
    return typeof value === 'undefined' || value === null;
};

const isNumber = (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value);
};

export const getOffset = (date: string): string | undefined => {
    const alternateFormatLength = 11; // 01-AUG-1932
    if (!isString(date) || date.length <= alternateFormatLength) {
        return undefined;
    }
    const offset = (date.match(/z$|[+-]\d*(:\d\d)?$/i) || [])[0];
    return offset && isString(offset) && offset.length > 0 && offset.length <= 6 ? offset : undefined;
};
