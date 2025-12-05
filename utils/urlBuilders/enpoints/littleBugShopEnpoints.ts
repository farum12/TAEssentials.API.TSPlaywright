export function createLittleBugShopEndpoints(buildUrl: (path: string) => string) {
    return {
        Users: {
            register: buildUrl('/Users/register'),
            login: buildUrl('/Users/login'),
            logout: buildUrl('/Users/logout'),
            getById: (id: number | string) => buildUrl(`/Users/${id}`),
            admin: {
                users: buildUrl('/Users/admin/users'),
                getUserById: (id: number | string) => buildUrl(`/Users/admin/users/${id}`),
                updateUser: (id: number | string) => buildUrl(`/Users/admin/users/${id}`),
                resetPassword: (id: number | string) => buildUrl(`/Users/admin/users/${id}/reset-password`),
            }
        },
        Products: {
            list: buildUrl('/Products'),
            create: buildUrl('/Products'),
            getById: (id: number | string) => buildUrl(`/Products/${id}`),
            update: (id: number | string) => buildUrl(`/Products/${id}`),
            delete: (id: number | string) => buildUrl(`/Products/${id}`),
            availability: (id: number | string) => buildUrl(`/Products/${id}/availability`),
            stock: (id: number | string) => buildUrl(`/Products/${id}/stock`),
            increaseStock: (id: number | string) => buildUrl(`/Products/${id}/stock/increase`),
            decreaseStock: (id: number | string) => buildUrl(`/Products/${id}/stock/decrease`),
        },
        Cart: {
            get: buildUrl('/Cart'),
            delete: buildUrl('/Cart'),
            addItem: buildUrl('/Cart/items'),
            updateItem: (itemId: number | string) => buildUrl(`/Cart/items/${itemId}`),
            removeItem: (itemId: number | string) => buildUrl(`/Cart/items/${itemId}`),
            checkout: buildUrl('/Cart/checkout'),
            applyCoupon: buildUrl('/Cart/apply-coupon'),
            removeCoupon: buildUrl('/Cart/remove-coupon'),
        },
        Orders: {
            create: buildUrl('/Orders/create'),
            place: buildUrl('/Orders/place'),
            list: buildUrl('/Orders'),
            myOrders: buildUrl('/Orders/my-orders'),
            getById: (id: number | string) => buildUrl(`/Orders/${id}`),
            delete: (id: number | string) => buildUrl(`/Orders/${id}`),
            updateStatus: (id: number | string) => buildUrl(`/Orders/${id}/status`),
            pending: buildUrl('/Orders/pending'),
            cancel: (id: number | string) => buildUrl(`/Orders/${id}/cancel`),
        },
        Profile: {
            get: buildUrl('/users/profile'),
            update: buildUrl('/users/profile'),
            addresses: {
                add: buildUrl('/users/profile/addresses'),
                update: (id: number | string) => buildUrl(`/users/profile/addresses/${id}`),
                delete: (id: number | string) => buildUrl(`/users/profile/addresses/${id}`),
                setDefault: (id: number | string) => buildUrl(`/users/profile/addresses/${id}/set-default`),
            },
            changePassword: buildUrl('/users/profile/change-password'),
        },
        Reviews: {
            create: (productId: number | string) => buildUrl(`/products/${productId}/Reviews`),
            list: (productId: number | string) => buildUrl(`/products/${productId}/Reviews`),
            getById: (productId: number | string, reviewId: number | string) => buildUrl(`/products/${productId}/Reviews/${reviewId}`),
            delete: (productId: number | string, reviewId: number | string) => buildUrl(`/products/${productId}/Reviews/${reviewId}`),
            myReview: (productId: number | string) => buildUrl(`/products/${productId}/my-review`),
            markHelpful: (reviewId: number | string) => buildUrl(`/reviews/${reviewId}/helpful`),
            moderate: (productId: number | string, reviewId: number | string) => buildUrl(`/products/${productId}/Reviews/${reviewId}/moderate`),
            admin: {
                list: buildUrl('/admin/reviews'),
            }
        },
        Wishlist: {
            get: buildUrl('/Wishlist'),
            clear: buildUrl('/Wishlist'),
            addItem: (productId: number | string) => buildUrl(`/Wishlist/items/${productId}`),
            removeItem: (productId: number | string) => buildUrl(`/Wishlist/items/${productId}`),
            checkItem: (productId: number | string) => buildUrl(`/Wishlist/check/${productId}`),
            moveToCart: buildUrl('/Wishlist/move-to-cart'),
            count: buildUrl('/Wishlist/count'),
        },
        PaymentMethods: {
            list: buildUrl('/payment-methods'),
            add: buildUrl('/payment-methods'),
            getById: (id: number | string) => buildUrl(`/payment-methods/${id}`),
            update: (id: number | string) => buildUrl(`/payment-methods/${id}`),
            delete: (id: number | string) => buildUrl(`/payment-methods/${id}`),
            setDefault: (id: number | string) => buildUrl(`/payment-methods/${id}/set-default`),
        },
        Payments: {
            process: buildUrl('/payments/process'),
            transactions: buildUrl('/payments/transactions'),
            getTransaction: (id: number | string) => buildUrl(`/payments/transactions/${id}`),
            refund: buildUrl('/payments/refund'),
            admin: {
                transactions: buildUrl('/payments/admin/transactions'),
                statistics: buildUrl('/payments/admin/statistics'),
            }
        },
        Coupons: {
            validate: (code: string) => buildUrl(`/Coupons/validate/${code}`),
            admin: {
                list: buildUrl('/Coupons/admin/coupons'),
                create: buildUrl('/Coupons/admin/coupons'),
                update: (id: number | string) => buildUrl(`/Coupons/admin/coupons/${id}`),
                delete: (id: number | string) => buildUrl(`/Coupons/admin/coupons/${id}`),
                usage: (id: number | string) => buildUrl(`/Coupons/admin/coupons/${id}/usage`),
            }
        },
        Session: {
            get: buildUrl('/Session'),
        }
    };
}