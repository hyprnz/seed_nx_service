import { CustomWorld } from './customWorld.ts';
import { AxiosError } from 'axios';
import { generateSymmetricIdTokenForMockedMode } from '@hyprnz/jwt';
import axios from 'axios';

interface Event {
    id?: string;
    subject: string;
    subjectName: string;
    name: string;
    description: string;
}

export class EventAPIRequest {
    public createEventResponse: any;

    public getEventResponse: any;

    constructor(private world: CustomWorld) {}

    public async createEvent(event: Event): Promise<void> {
        try {
            const apiResponse = await axios({
                url: `${this.world.config.baseUrl}/event`,
                method: 'POST',
                responseType: 'json',
                headers: {
                    'x-correlation-id': '1234-1234-1234',
                    Authorization: `Bearer ${generateSymmetricIdTokenForMockedMode()}`
                },
                data: {
                    ...event
                },
                timeout: 20000
            });
            this.world.apiResponseStatus = apiResponse.status;
            this.createEventResponse = apiResponse.data;
        } catch (error: any) {
            console.error('API Error message: ', error.message);
            console.error('API Error status: ', error?.response?.status);
            this.world.apiResponseStatus = error.response?.status;
            this.world.apiError = error;
            throw error;
        }
    }

    public async getEvent(eventId: string): Promise<void> {
        try {
            const apiResponse = await axios({
                url: `${this.world.config.baseUrl}/event/${eventId}`,
                method: 'GET',
                responseType: 'json',
                headers: {
                    'x-correlation-id': '1234-1234-1234',
                    Authorization: `Bearer ${generateSymmetricIdTokenForMockedMode()}`
                },
                timeout: 20000
            });
            this.world.apiResponseStatus = apiResponse.status;
            this.getEventResponse = apiResponse.data;
            console.log('this.getEventResponse: ', this.getEventResponse);
        } catch (error: any) {
            console.error('API Error message: ', error.message);
            console.error('API Error status: ', error?.response?.status);
            this.world.apiResponseStatus = (error as AxiosError).response?.status;
            this.world.apiError = error;
            throw error;
        }
    }
}
