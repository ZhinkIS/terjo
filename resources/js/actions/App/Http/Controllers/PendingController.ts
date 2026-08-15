import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PendingController::index
 * @see app/Http/Controllers/PendingController.php:18
 * @route '/pending'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/pending/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PendingController::status
 * @see app/Http/Controllers/PendingController.php:33
 * @route '/pending/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const PendingController = { index, status }

export default PendingController