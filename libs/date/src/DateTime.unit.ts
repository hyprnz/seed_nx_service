import {
    DateTime,
    dateTimeForNzZoneTransformer,
    dateTimeForZoneTransformerWithNulls,
    dateTimeTransformer,
    dateTimeTransformerWithNulls,
    getOffset,
    makeMicroseconds,
    TimeZones
} from './DateTime';
import { describe, expect, it } from 'vitest';

describe('DateTime', () => {
    const date = DateTime.fromDate(new Date('2019-07-06T00:00:00.000000+12:00'));
    const dateWithMicroseconds = DateTime.fromStringWithoutValidation('2019-07-06T11:03:59.123456+12:00');

    describe('fromStringWithoutValidation', () => {
        it('same tz', () => {
            const datetimeOne = DateTime.fromStringWithoutValidation('2019-07-06T11:03:59.123456+12:00');
            const datetimeTwo = DateTime.fromStringWithoutValidation('2019-07-06T11:03:59.123456+12:00');
            expect(datetimeOne.equals(datetimeTwo)).toBe(true);
        });

        it('different tz', () => {
            const datetimeOne = DateTime.fromStringWithoutValidation('2019-07-06T11:03:59.123456+10:00');
            const datetimeTwo = DateTime.fromStringWithoutValidation('2019-07-06T13:03:59.123456+12:00');
            expect(datetimeOne.equals(datetimeTwo)).toBe(true);
        });

        it('Zulu', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T13:03:59.123456Z')?.toUtcString(TimeZones.Utc)).toBe(
                '2019-07-06T13:03:59.123456+00:00'
            );
        });
        it('no colon', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T13:03:59.123456+0000')?.toUtcString(TimeZones.Utc)).toBe(
                '2019-07-06T13:03:59.123456+00:00'
            );
        });
        it('two digits', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T13:03:59.123456+00')?.toUtcString(TimeZones.Utc)).toBe(
                'Invalid Date.123456Invalid Date'
            );
        });
    });

    describe('fromDate()', () => {
        it('from invalid date', () => {
            expect(() => DateTime.fromDate(new Date('junk'))).toThrowError('Failed to create DateTime with invalid date');
        });
        it('milliseconds', () => {
            const date1 = DateTime.fromDate(new Date('2019-07-06T23:59:59.123+12:00'));
            expect(date1.toUtcString()).toEqual('2019-07-06T23:59:59.123000+12:00');
        });
        it('microseconds ignored', () => {
            const date1 = DateTime.fromDate(new Date('2019-07-06T23:59:59.123987+12:00'));
            expect(date1.toUtcString()).toEqual('2019-07-06T23:59:59.123000+12:00');
        });
        it('no time', () => {
            const date1 = DateTime.fromDate(new Date('2019-07-06'));
            expect(date1.toUtcString()).toEqual('2019-07-06T12:00:00.000000+12:00');
        });
        it('half hour offset', () => {
            const date1 = DateTime.fromDate(new Date('1940-05-13T00:00:00+1130'));
            expect(date1.toUtcString()).toEqual('1940-05-13T00:00:00.000000+11:30');
        });
    });

    describe('now()', () => {
        it('matches time with milliseconds', () => {
            const date1 = new Date();
            expect(DateTime.now(date1).toMillisecondTime()).toEqual(date1.getTime());
        });
    });

    describe('toUtcString()', () => {
        it('no time', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06').toUtcString()).toEqual('2019-07-06T12:00:00.000000+12:00');
        });
        it('no time UTC', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06').toUtcString(TimeZones.Utc)).toEqual('2019-07-06T00:00:00.000000+00:00');
        });
        it('no offset', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06 00:01:02').toUtcString()).toEqual('2019-07-06T12:01:02.000000+12:00');
        });
        it('no offset UTC', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06 00:01:02').toUtcString(TimeZones.Utc)).toEqual(
                '2019-07-06T00:01:02.000000+00:00'
            );
        });
        it('partial offset', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06 00:01:02+00').toUtcString(TimeZones.Utc)).toEqual(
                '2019-07-06T00:01:02.000000+00:00'
            );
        });
        it('zulu offset', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06 00:01:02Z').toUtcString(TimeZones.Utc)).toEqual(
                '2019-07-06T00:01:02.000000+00:00'
            );
        });
        it('no micro seconds', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T00:00:00+12:00').toUtcString()).toEqual('2019-07-06T00:00:00.000000+12:00');
        });
        it('zero micro seconds', () => {
            expect(date.toUtcString()).toEqual('2019-07-06T00:00:00.000000+12:00');
        });
        it('milli seconds', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T00:00:00.123+12:00').toUtcString()).toEqual('2019-07-06T00:00:00.123000+12:00');
        });
        it('microseconds', () => {
            expect(DateTime.fromStringWithoutValidation('2019-07-06T00:00:00.123456+12:00').toUtcString()).toEqual(
                '2019-07-06T00:00:00.123456+12:00'
            );
        });
        it('microseconds with time', () => {
            expect(dateWithMicroseconds.toUtcString()).toEqual('2019-07-06T11:03:59.123456+12:00');
        });
        it('parsed', () => {
            expect(
                DateTime.parse({
                    date: '1940-05-13',
                    microseconds: 0
                })?.toUtcString(TimeZones.Utc)
            ).toEqual('1940-05-13T00:00:00.000000+00:00');
        });
    });

    it('toString()', () => {
        expect(date.toString()).toEqual('2019-07-06T00:00:00.000000+12:00');
    });

    describe('plusDays()', () => {
        it('one', () => {
            expect(date.plusDays(1).toUtcString()).toEqual('2019-07-07T00:00:00.000000+12:00');
        });

        it('10 with microseconds', () => {
            expect(dateWithMicroseconds.plusDays(10).toUtcString()).toEqual('2019-07-16T11:03:59.123456+12:00');
        });
    });

    describe('makeMicroseconds()', () => {
        let x: any;
        it('not a string returns 0', () => {
            expect(makeMicroseconds({} as string)).toEqual(0);
            expect(makeMicroseconds(x)).toEqual(0);
        });
        it('utc zero time returns 0', () => {
            expect(makeMicroseconds('Thu Jan 01 1970 12:00:00 GMT+1200 (NZST)')).toEqual(0);
        });
        it('utc with a z', () => {
            expect(makeMicroseconds('2016-03-01T23:00:00.000001Z')).toEqual(0.000001);
        });
        it('utc zero time returns 0', () => {
            expect(makeMicroseconds('2016-03-01T23:00:00.000000+00:00')).toEqual(0);
        });
        it('no time returns 0', () => {
            expect(makeMicroseconds('2016-09-28')).toEqual(0);
        });
        it('no microseconds returns 0', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00')).toEqual(0);
        });
        it('valid utc publish 6', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.123456+00:00')).toEqual(0.123456);
        });
        it('valid publish 6', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.123456+13:00')).toEqual(0.123456);
        });
        it('valid publish 6 with negative offset', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.123456-13:00')).toEqual(0.123456);
        });
        it('valid publish 7', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.1234567+13:00')).toEqual(0.123456);
        });
        it('valid publish 7 with negative offset', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.1234567-13:00')).toEqual(0.123456);
        });
        it('valid with none', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00+13:00')).toEqual(0);
        });
        it('valid with 3 digits z', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.123')).toEqual(0.123);
        });
        it('valid with z', () => {
            expect(makeMicroseconds('2016-09-28T00:00:00.123456Z')).toEqual(0.123456);
        });
    });

    describe('fromMicrosecondTime()', () => {
        it('min', () => {
            expect(DateTime.fromMicrosecondTime(DateTime.min().toMicrosecondTime()).toMicrosecondTime()).toEqual(DateTime.min().toMicrosecondTime());
        });
        it('min string', () => {
            expect(DateTime.min().toUtcString()).toEqual('1938-04-25T09:43:20.000000+11:30');
        });
        it('max', () => {
            expect(DateTime.fromMicrosecondTime(DateTime.max().toMicrosecondTime()).toMicrosecondTime()).toEqual(DateTime.max().toMicrosecondTime());
        });
        it('max string', () => {
            expect(DateTime.max().toUtcString()).toEqual('2286-11-21T06:46:40.000000+13:00');
        });
        it('microseconds', () => {
            expect(DateTime.fromMicrosecondTime(1474977661123456).toMicrosecondTime()).toEqual(1474977661123456);
        });
        it('milliseconds', () => {
            expect(DateTime.fromMicrosecondTime(1474977661123000).toMicrosecondTime()).toEqual(1474977661123000);
        });
        it('big number', () => {
            expect(DateTime.fromMicrosecondTime(1474977661123456).toMicrosecondTime()).toEqual(1474977661123456);
        });
        it('Microseconds keeps precision', () => {
            const dateString = '2016-09-28T01:01:01.123456+13:00';
            const dateTime1 = DateTime.fromString(dateString);
            expect(DateTime.fromMicrosecondTime(dateTime1.toMicrosecondTime()).toUtcString()).toEqual(dateString);
        });
        it('microseconds mod', () => {
            expect((1474977661001001 % 1000000) / 1000000).toEqual(0.001001);
        });
        it('microseconds mod floor', () => {
            expect(Math.floor(1474977661001001 / 1000)).toEqual(1474977661001);
        });
    });

    describe('fromMillisecondTime()', () => {
        it('Milliseconds', () => {
            const dateTime1 = DateTime.fromString('2016-09-28T01:01:01.1234567+13:00');
            expect(DateTime.fromMillisecondTime(dateTime1.toNumber()).toMicrosecondTime()).toEqual(dateTime1.toNumber() * 1000);
        });
        it('Milliseconds loses higher precision', () => {
            const dateString = '2016-09-28T01:01:01.123456+13:00';
            const dateTime1 = DateTime.fromString(dateString);
            expect(DateTime.fromMillisecondTime(dateTime1.toNumber()).toUtcString()).toEqual('2016-09-28T01:01:01.123000+13:00');
        });
        it('Seconds', () => {
            const dateTime1 = DateTime.fromString('2016-09-28T00:00:00.000000+13:00');
            expect(DateTime.fromMillisecondTime(dateTime1.toNumber() * 1000).toMicrosecondTime()).toEqual(dateTime1.toMicrosecondTime() * 1000);
        });
    });

    describe('toEpochTime()', () => {
        it('same low decimal', () => {
            expect(DateTime.fromString('2016-09-28T01:01:01.111111+13:00').toEpochTime()).toEqual(
                DateTime.fromString('2016-09-28T01:01:01.000000+13:00').toEpochTime()
            );
        });
        it('same high decimal', () => {
            expect(DateTime.fromString('2016-09-28T01:01:01.999999+13:00').toEpochTime()).toEqual(
                DateTime.fromString('2016-09-28T01:01:01.000000+13:00').toEpochTime()
            );
        });
        it('different second', () => {
            expect(
                DateTime.fromString('2016-09-28T01:01:02.000000+13:00').toEpochTime() >
                    DateTime.fromString('2016-09-28T01:01:01.000000+13:00').toEpochTime()
            ).toEqual(true);
            expect(
                DateTime.fromString('2016-09-28T01:01:02.000000+13:00').toEpochTime() <
                    DateTime.fromString('2016-09-28T01:01:01.000000+13:00').toEpochTime()
            ).toEqual(false);
        });
    });

    describe('before()', () => {
        it('true', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.000+13:00').before(DateTime.fromString('2016-09-28T00:00:00.000+13:00'))).toEqual(true);
        });
        it('true with microsecond difference', () => {
            expect(DateTime.fromMicrosecondTime(1474977661123456).before(DateTime.fromMicrosecondTime(1474977661123456 + 1))).toEqual(true);
        });
        it('false', () => {
            expect(DateTime.fromString('2016-09-28T00:00:00.000+13:00').before(DateTime.fromString('2016-09-27T00:00:00.000+13:00'))).toEqual(false);
        });
    });

    describe('after()', () => {
        it('true', () => {
            expect(DateTime.fromString('2016-09-28T00:00:00.000+13:00').after(DateTime.fromString('2016-09-27T00:00:00.000+13:00'))).toEqual(true);
        });
        it('true with microsecond difference', () => {
            expect(DateTime.fromMicrosecondTime(1474977661123456 + 1).after(DateTime.fromMicrosecondTime(1474977661123456))).toEqual(true);
        });
        it('false', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.000+13:00').after(DateTime.fromString('2016-09-28T00:00:00.000+13:00'))).toEqual(false);
        });
    });

    describe('equals()', () => {
        it('true', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.000+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.000+13:00'))).toEqual(true);
        });
        it('true to 6 digit millisecond', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.123456+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.123456+13:00'))).toEqual(
                true
            );
        });
        it('true to 6 digit millisecond starting with 0', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.003456+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.003456+13:00'))).toEqual(
                true
            );
        });
        it('false when milliseconds different', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.123456+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.123451+13:00'))).toEqual(
                false
            );
        });
        it('false when milliseconds different', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.12345+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.123456+13:00'))).toEqual(
                false
            );
        });
        it('true when microseconds different at position 7', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.1234567+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.1234561+13:00'))).toEqual(
                true
            );
        });
        it('false', () => {
            const subject = DateTime.fromString('2016-09-27T00:00:00.000+13:00');
            expect(subject.equals(DateTime.fromString('2016-09-28T00:00:00.000+13:00'))).toEqual(false);
            expect(subject.equals(DateTime.fromString('2016-10-27T00:00:00.000+13:00'))).toEqual(false);
            expect(subject.equals(DateTime.fromString('2017-09-27T00:00:00.000+13:00'))).toEqual(false);
        });
        it('false when 3rd digit of milliseconds is different', () => {
            expect(DateTime.fromString('2016-09-27T00:00:00.12+13:00').equals(DateTime.fromString('2016-09-27T00:00:00.1234567+13:00'))).toEqual(
                false
            );
        });
    });

    describe('plusHours()', () => {
        it('days as 24 hours', () => {
            const expected = '2016-09-29T00:00:00.000000+13:00';
            const from = '2016-09-28T00:00:00.000+13:00';
            expect(DateTime.fromString(from).plusHours(24).toUtcString()).toEqual(expected);
            expect(DateTime.fromString(from).plusDays(1).toUtcString()).toEqual(expected);
        });
        it('2', () => {
            expect(DateTime.fromString('2016-09-28T00:00:00.000+13:00').plusHours(2).toUtcString()).toEqual('2016-09-28T02:00:00.000000+13:00');
        });
        it('-3', () => {
            expect(DateTime.fromString('2016-09-28T00:00:00.000+13:00').plusHours(-3).toUtcString()).toEqual('2016-09-27T21:00:00.000000+13:00');
        });
    });

    describe('plusSeconds()', () => {
        const from = '2016-09-29T00:00:00.000000+13:00';
        it('plus', () => {
            expect(DateTime.fromString(from).plusSeconds(1).toUtcString()).toEqual('2016-09-29T00:00:01.000000+13:00');
        });
        it('minus', () => {
            expect(DateTime.fromString(from).plusSeconds(-1).toUtcString()).toEqual('2016-09-28T23:59:59.000000+13:00');
        });
    });

    describe('plusSeconds()', () => {
        const from = '2016-09-29T00:00:00.000000+13:00';
        it('plus', () => {
            expect(DateTime.fromString(from).plusSeconds(1).toUtcString()).toEqual('2016-09-29T00:00:01.000000+13:00');
        });
        it('minus', () => {
            expect(DateTime.fromString(from).plusSeconds(-1).toUtcString()).toEqual('2016-09-28T23:59:59.000000+13:00');
        });
    });

    describe('plusMilliSeconds()', () => {
        const from = '2016-09-29T00:00:00.000000+13:00';
        it('plus', () => {
            expect(DateTime.fromString(from).plusMilliSeconds(1).toUtcString()).toEqual('2016-09-29T00:00:00.001000+13:00');
        });
        it('minus', () => {
            expect(DateTime.fromString(from).plusMilliSeconds(-1).toUtcString()).toEqual('2016-09-28T23:59:59.999000+13:00');
        });
    });

    describe('plusMicroseconds()', () => {
        const from = '2016-09-29T00:00:00.000000+13:00';
        it('plus', () => {
            expect(DateTime.fromString(from).plusMicroseconds(1).toUtcString()).toEqual('2016-09-29T00:00:00.000001+13:00');
        });
        it('minus', () => {
            expect(DateTime.fromString(from).plusMicroseconds(-1).toUtcString()).toEqual('2016-09-28T23:59:59.999999+13:00');
        });
    });

    describe('toFormattedString()', () => {
        const date = '2016-09-28T01:02:03.456789+13:00';

        it('date', () => {
            expect(DateTime.fromString(date).toFormattedString('YYYY-MM-DD')).toEqual('2016-09-28');
        });
        it('time AM', () => {
            expect(DateTime.fromString(date).toFormattedString('HH:mm:ss A')).toEqual('01:02:03 AM');
        });
        it('time PM', () => {
            expect(DateTime.fromString('2016-09-28T23:02:03.456789+13:00').toFormattedString('hh:mm:ss A')).toEqual('11:02:03 PM');
        });
        it('date with month short name', () => {
            expect(DateTime.fromString(date).toFormattedString('DD MMM YYYY')).toEqual('28 Sep 2016');
        });
    });

    describe('isDateTime()', () => {
        const date = DateTime.now();

        it('true', () => {
            expect(DateTime.isDateTime(date)).toBeTruthy();
        });

        it('true as object', () => {
            expect(DateTime.isDateTime({ ...date })).toBeFalsy();
        });

        it('false', () => {
            expect(DateTime.isDateTime(new Date())).toBeFalsy();
            expect(DateTime.isDateTime(Date.now())).toBeFalsy();
            expect(DateTime.isDateTime(1)).toBeFalsy();
            expect(DateTime.isDateTime({ date })).toBeFalsy();
            expect(DateTime.isDateTime('')).toBeFalsy();
            expect(DateTime.isDateTime(undefined)).toBeFalsy();
            expect(DateTime.isDateTime(null)).toBeFalsy();
            expect(DateTime.isDateTime('2016-09-28T23:02:03.456789+13:00')).toBeFalsy();
        });
    });

    describe('parse()', () => {
        const date = DateTime.now();

        it('nz month as string', () => {
            expect(DateTime.parse('30-JUN-1955', TimeZones.PacificAuckland)?.toUtcString(TimeZones.PacificAuckland)).toEqual(
                '1955-06-30T00:00:00.000000+12:00'
            );
        });
        it('nz no offset', () => {
            expect(DateTime.parse('2019-07-07', TimeZones.PacificAuckland)?.toUtcString(TimeZones.PacificAuckland)).toEqual(
                '2019-07-07T00:00:00.000000+12:00'
            );
        });
        it('nz with no colon', () => {
            expect(DateTime.parse('1940-05-13T00:00:00+1130', TimeZones.PacificAuckland)?.toUtcString(TimeZones.PacificAuckland)).toEqual(
                '1940-05-13T00:00:00.000000+11:30'
            );
        });

        it('parses date time', () => {
            expect(DateTime.parse(date)!.toUtcString()).toEqual(date.toUtcString());
        });

        it('parses number', () => {
            expect(DateTime.parse(0)).toEqual(DateTime.parse('1970-01-01T00:00:00.000Z'));
        });

        it('parses string', () => {
            const date = '2016-09-28T23:02:03.456789+13:00';
            expect(DateTime.parse(date)!.toUtcString()).toEqual(DateTime.fromString(date).toUtcString());
        });

        it('parses object', () => {
            expect(DateTime.parse({ ...date })!.toUtcString()).toEqual(date.toUtcString());
        });

        it('parses object with date and zero microseconds', () => {
            expect(
                DateTime.parse({
                    date: '2020-03-26T04:18:53.123Z',
                    microseconds: 0
                })!.toUtcString()
            ).toEqual('2020-03-26T17:18:53.123000+13:00');
        });

        it('parses object with date and non zero microseconds', () => {
            expect(DateTime.parse({ date: '2020-03-26T04:18:53.123Z', microseconds: 0.123456 })!.toUtcString()).toEqual(
                '2020-03-26T17:18:53.123456+13:00'
            );
        });

        it('parses date time', () => {
            expect(DateTime.parse(date)!.toUtcString()).toEqual(date.toUtcString());
        });

        it('parses date', () => {
            const date = new Date();
            expect(DateTime.parse(date)!.toNumber()).toEqual(date.getTime());
        });

        it('parses from number and back', () => {
            expect(DateTime.parse('2020-04-16T21:55:57.565000+12:00')!.toNumber()).toEqual(new Date('2020-04-16T21:55:57.565000+12:00').getTime());
        });

        it('parses from number and back to numner', () => {
            const now = DateTime.now();
            const result = DateTime.parse(now.toNumber());
            expect(result!.toUtcString()).toEqual(now.toUtcString());
        });

        it('parses from object with 0 microseconds', () => {
            const clock = DateTime.parse('2021-07-01T00:00:00+00:00');
            const now = { date: clock?.toDate(), microseconds: 0 };
            const result = DateTime.parse(now);
            expect(result!.toUtcString()).toEqual('2021-07-01T12:00:00.000000+12:00');
        });

        it('parses half hour offset', () => {
            const date1 = DateTime.parse('1940-05-13T00:00:00+1130');
            expect(date1!.toUtcString()).toEqual('1940-05-13T00:00:00.000000+11:30');
        });

        it('does not parse', () => {
            expect(DateTime.parse({ date })).toBeUndefined();
            expect(DateTime.parse('')).toBeUndefined();
            expect(DateTime.parse(undefined)).toBeUndefined();
            expect(DateTime.parse(null)).toBeUndefined();
        });
    });

    describe('parseStrict', () => {
        const date = DateTime.now();
        it('parses date time', () => {
            expect(DateTime.parseStrict(date).toUtcString()).toEqual(date.toUtcString());
        });

        it('parses number', () => {
            expect(DateTime.parseStrict(0)).toEqual(DateTime.parse('1970-01-01T00:00:00.000Z'));
        });

        it('parses string', () => {
            const date = '2016-09-28T23:02:03.456789+13:00';
            expect(DateTime.parseStrict(date).toUtcString()).toEqual(DateTime.fromString(date).toUtcString());
        });

        it('parses object', () => {
            expect(DateTime.parseStrict({ ...date }).toUtcString()).toEqual(date.toUtcString());
        });

        it('Fails on date object', () => {
            expect(() => DateTime.parseStrict({ date })).toThrowError('Failed DateTime.parseStrict(');
        });

        it('Fails on empty string', () => {
            expect(() => DateTime.parseStrict('')).toThrowError('Failed DateTime.parseStrict("")');
        });

        it('Fails on undefined', () => {
            expect(() => DateTime.parseStrict(undefined)).toThrowError('Failed DateTime.parseStrict(undefined)');
        });

        it('Fails on null', () => {
            expect(() => DateTime.parseStrict(null)).toThrowError('Failed DateTime.parseStrict(null)');
        });
    });

    describe('dateTimeTransformer.', () => {
        it('to(date)', () => {
            expect(dateTimeTransformer.to(date)).toEqual(date.toUtcString());
        });

        it('from(null)', () => {
            expect(dateTimeTransformer.from(null as any)).toEqual(null);
        });

        it('from(valid string)', () => {
            expect(dateTimeTransformer.from(date.toUtcString())!.toUtcString()).toEqual(date.toUtcString());
        });

        describe('fails', () => {
            it('from(empty string)', () => {
                expect(() => dateTimeTransformer.from('')).toThrowError('Failed dateTimeTransformer.from("")');
            });

            it('from(invalid string)', () => {
                expect(() => dateTimeTransformer.from('junk')).toThrowError('Failed dateTimeTransformer.from("junk")');
            });

            it('to(Symbol())', () => {
                expect(() => dateTimeTransformer.to(Symbol() as any)).toThrowError('Failed dateTimeTransformer.to(undefined)');
            });

            it('to(null)', () => {
                expect(() => dateTimeTransformer.to(null)).toThrowError('Failed dateTimeTransformer.to(null)');
            });
        });
    });

    describe('dateTimeTransformerWithNulls:', () => {
        it('to(date)', () => {
            expect(dateTimeTransformerWithNulls.to(date)).toEqual(date.toUtcString());
        });

        it('to(null)', () => {
            expect(dateTimeTransformerWithNulls.to(null)).toEqual(null);
        });

        it('from(string)', () => {
            expect(dateTimeTransformerWithNulls.from(date.toUtcString())!.toUtcString()).toEqual(date.toUtcString());
        });

        it('from(invalid string)', () => {
            expect(() => dateTimeTransformer.from('junk')).toThrow();
        });

        it('from(null)', () => {
            expect(dateTimeTransformerWithNulls.from(null)).toEqual(null);
        });
    });

    describe('dateOnlyTransformer:', () => {
        const dateOnly = DateTime.fromString('1940-05-13T00:00:00+1130')!;

        it('to(date)', () => {
            expect(dateTimeForZoneTransformerWithNulls.to(dateOnly)).toEqual(dateOnly.toUtcString());
        });

        it('to(null)', () => {
            expect(dateTimeForZoneTransformerWithNulls.to(null)).toEqual(null);
        });

        it('from(string)', () => {
            expect(dateTimeForZoneTransformerWithNulls.from(dateOnly.toUtcString())!.toUtcString()).toEqual(dateOnly.toUtcString());
        });

        it('from(invalid string)', () => {
            expect(() => dateTimeForNzZoneTransformer.from('junk')).toThrow();
        });

        it('from(null)', () => {
            expect(dateTimeForZoneTransformerWithNulls.from(null)).toEqual(null);
        });
    });

    describe('getOffset', () => {
        it('nz month as string', () => {
            expect(getOffset('30-JUN-1955')).toBeUndefined();
        });
        it('short date', () => {
            expect(getOffset('1955-01-01')).toBeUndefined();
        });
        it('+ offset no colon', () => {
            expect(getOffset('1940-05-13T00:00:00+1130')).toEqual('+1130');
        });
        it('+ offset no colon', () => {
            expect(getOffset('1940-05-13T00:00:00-1130')).toEqual('-1130');
        });
        it('+ offset', () => {
            expect(getOffset('1940-05-13T00:00:00+12:00')).toEqual('+12:00');
        });
        it('+ offset shorter', () => {
            expect(getOffset('1940-05-13 00:00:00+12:00')).toEqual('+12:00');
        });
        it('+ offset microseconds', () => {
            expect(getOffset('1940-05-13 00:00:00.123456+12:00')).toEqual('+12:00');
        });
        it('- offset', () => {
            expect(getOffset('1940-05-13T00:00:00-12:00')).toEqual('-12:00');
        });
        it('z offset', () => {
            expect(getOffset('1929-12-06T12:00:00.000Z')).toEqual('Z');
        });
        it('no offset', () => {
            expect(getOffset('1929-12-06T12:00:00.000')).toBeUndefined();
        });
        it('no offset shorter', () => {
            expect(getOffset('1929-12-06T12:00:00')).toBeUndefined();
        });
        it('no offset shorter no T', () => {
            expect(getOffset('1929-12-06 12:00:00')).toBeUndefined();
        });
    });
});
