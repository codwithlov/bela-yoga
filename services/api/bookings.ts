import { IApiResponse } from '@/interfaces/apiResponse';
import { IBookingSummary, ICreateBookingPayload } from '@/interfaces/booking';
import { baseApi } from './baseApi';

const bookingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation<IApiResponse & { data: IBookingSummary }, ICreateBookingPayload>({
            query(body) {
                return {
                    url: 'bookings',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body,
                };
            },
        }),
        cancelBooking: builder.mutation<IApiResponse & { data: IBookingSummary }, { bookingId: number; note?: string }>({
            query({ bookingId, note }) {
                return {
                    url: `bookings/${bookingId}/cancel`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: { note },
                };
            },
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useCancelBookingMutation,
} = bookingsApi;
