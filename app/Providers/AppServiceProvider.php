<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Vite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use ReflectionProperty;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $request = $this->app->make(Request::class);

        if (app()->environment('production') || $request->isSecure()) {
            config(['session.secure' => true]);

            URL::forceScheme('https');
        }

        $this->configureDefaults();
        $this->configureRateLimiting();

        if (getenv('VERCEL') !== false || isset($_SERVER['VERCEL']) || isset($_ENV['VERCEL'])) {
            $this->clearViteManifestCache();
        }
    }

    /**
     * Clear the process-wide Vite manifest cache on Vercel.
     *
     * Vercel may reuse PHP processes across deployments where only built
     * assets changed. Laravel caches the decoded manifest in a static
     * property, which can leave @vite pointing at a CSS file that no longer
     * exists in the newly deployed public/build directory.
     */
    protected function clearViteManifestCache(): void
    {
        $manifests = new ReflectionProperty(Vite::class, 'manifests');
        $manifests->setValue(null, []);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );
    }

    /**
     * Configure the application's rate limiters.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->input('email').'|'.$request->ip());
        });
    }
}
