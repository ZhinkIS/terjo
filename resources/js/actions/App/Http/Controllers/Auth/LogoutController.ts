import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\LogoutController::destroy
 * @see app/Http/Controllers/Auth/LogoutController.php:15
 * @route '/logout'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\LogoutController::destroy
 * @see app/Http/Controllers/Auth/LogoutController.php:15
 * @route '/logout'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\LogoutController::destroy
 * @see app/Http/Controllers/Auth/LogoutController.php:15
 * @route '/logout'
 */
destroy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Auth\LogoutController::destroy
 * @see app/Http/Controllers/Auth/LogoutController.php:15
 * @route '/logout'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Auth\LogoutController::destroy
 * @see app/Http/Controllers/Auth/LogoutController.php:15
 * @route '/logout'
 */
        destroyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(options),
            method: 'post',
        })
    
    destroy.form = destroyForm
const LogoutController = { destroy }

export default LogoutController