import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SlideshowController::store
 * @see app/Http/Controllers/Admin/SlideshowController.php:41
 * @route '/admin/slideshows'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/slideshows',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SlideshowController::store
 * @see app/Http/Controllers/Admin/SlideshowController.php:41
 * @route '/admin/slideshows'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SlideshowController::store
 * @see app/Http/Controllers/Admin/SlideshowController.php:41
 * @route '/admin/slideshows'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SlideshowController::store
 * @see app/Http/Controllers/Admin/SlideshowController.php:41
 * @route '/admin/slideshows'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SlideshowController::store
 * @see app/Http/Controllers/Admin/SlideshowController.php:41
 * @route '/admin/slideshows'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\SlideshowController::reorder
 * @see app/Http/Controllers/Admin/SlideshowController.php:27
 * @route '/admin/slideshows/reorder'
 */
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reorder.url(options),
    method: 'put',
})

reorder.definition = {
    methods: ["put"],
    url: '/admin/slideshows/reorder',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SlideshowController::reorder
 * @see app/Http/Controllers/Admin/SlideshowController.php:27
 * @route '/admin/slideshows/reorder'
 */
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SlideshowController::reorder
 * @see app/Http/Controllers/Admin/SlideshowController.php:27
 * @route '/admin/slideshows/reorder'
 */
reorder.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reorder.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SlideshowController::reorder
 * @see app/Http/Controllers/Admin/SlideshowController.php:27
 * @route '/admin/slideshows/reorder'
 */
    const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SlideshowController::reorder
 * @see app/Http/Controllers/Admin/SlideshowController.php:27
 * @route '/admin/slideshows/reorder'
 */
        reorderForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reorder.form = reorderForm
/**
* @see \App\Http\Controllers\Admin\SlideshowController::update
 * @see app/Http/Controllers/Admin/SlideshowController.php:59
 * @route '/admin/slideshows/{slideshow}'
 */
export const update = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/slideshows/{slideshow}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\SlideshowController::update
 * @see app/Http/Controllers/Admin/SlideshowController.php:59
 * @route '/admin/slideshows/{slideshow}'
 */
update.url = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slideshow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { slideshow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    slideshow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slideshow: typeof args.slideshow === 'object'
                ? args.slideshow.id
                : args.slideshow,
                }

    return update.definition.url
            .replace('{slideshow}', parsedArgs.slideshow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SlideshowController::update
 * @see app/Http/Controllers/Admin/SlideshowController.php:59
 * @route '/admin/slideshows/{slideshow}'
 */
update.put = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\SlideshowController::update
 * @see app/Http/Controllers/Admin/SlideshowController.php:59
 * @route '/admin/slideshows/{slideshow}'
 */
    const updateForm = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SlideshowController::update
 * @see app/Http/Controllers/Admin/SlideshowController.php:59
 * @route '/admin/slideshows/{slideshow}'
 */
        updateForm.put = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\SlideshowController::destroy
 * @see app/Http/Controllers/Admin/SlideshowController.php:78
 * @route '/admin/slideshows/{slideshow}'
 */
export const destroy = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/slideshows/{slideshow}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SlideshowController::destroy
 * @see app/Http/Controllers/Admin/SlideshowController.php:78
 * @route '/admin/slideshows/{slideshow}'
 */
destroy.url = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slideshow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { slideshow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    slideshow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slideshow: typeof args.slideshow === 'object'
                ? args.slideshow.id
                : args.slideshow,
                }

    return destroy.definition.url
            .replace('{slideshow}', parsedArgs.slideshow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SlideshowController::destroy
 * @see app/Http/Controllers/Admin/SlideshowController.php:78
 * @route '/admin/slideshows/{slideshow}'
 */
destroy.delete = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SlideshowController::destroy
 * @see app/Http/Controllers/Admin/SlideshowController.php:78
 * @route '/admin/slideshows/{slideshow}'
 */
    const destroyForm = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SlideshowController::destroy
 * @see app/Http/Controllers/Admin/SlideshowController.php:78
 * @route '/admin/slideshows/{slideshow}'
 */
        destroyForm.delete = (args: { slideshow: number | { id: number } } | [slideshow: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const slideshows = {
    store: Object.assign(store, store),
reorder: Object.assign(reorder, reorder),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default slideshows