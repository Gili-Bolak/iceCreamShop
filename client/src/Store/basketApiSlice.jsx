import apiSlice from "./apiSlice"


const basketApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getBaskets: build.query({
            query: () => ({
                url: '/api/basket'
            })
        }),
        getBasketsUser: build.query({
            query: (user) => ({
                url: `/api/basket/${user}`,
            }),
            providesTags: ["Basket"]
        }),
        AddItemForBasket: build.mutation({
            query: (basketData) => ({
                url: `/api/basket/${basketData.user}`,
                method: "PUT",
                body: basketData
            }),
            invalidatesTags: ["Basket"]
        }),
        UpdateQuantity: build.mutation({
            query: (basketData) => ({
                url: `/api/basket/${basketData._id}/item/${basketData.item}`,
                method: "PUT",
                body: basketData
            }),
            invalidatesTags: ["Basket"]
        }),
        DeleteItemFromBasket: build.mutation({
            query: (basketData) => ({
                url: `/api/basket/${basketData._id}/item/${basketData.item}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Basket"]
        }),
        DeleteBasket: build.mutation({
            query: (_id) => ({
                url: `/api/basket/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Basket"]
        }),
    })
})


export const { useGetBasketsQuery, useGetBasketsUserQuery, useAddItemForBasketMutation, useUpdateQuantityMutation, useDeleteItemFromBasketMutation, useDeleteBasketMutation } = basketApiSlice