import apiSlice from "./apiSlice"


const itemApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getAllItem: build.query({
            query: () => ({
                url: '/api/item'
            }),
            providesTags: ["Items"]
        }),
        getItemByCategory: build.query({
            query: (category) => ({
                url: `/api/item/${category}`
            }),
            providesTags: ["Items"]
        }),
        addItem: build.mutation({
            query: (item) => ({
                url: "api/item",
                method: "POST",
                body: item
            }),
            invalidatesTags: ["Items"]
        }),
        updateItem: build.mutation({
            query: (item) => ({
                url: `api/item/${item._id}`,
                method: "PUT",
                body: item
            }),
            invalidatesTags: ["Items"]
        }),
        deleteItem: build.mutation({
            query: (_id) => ({
                url: `api/item/${_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Items"]
        }),
    }),
})


export const { useGetAllItemQuery, useGetItemByCategoryQuery, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation } = itemApiSlice