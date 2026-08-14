<?php

namespace App\Models;

use Database\Factories\SettingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string|null $site_name
 * @property string|null $logo_path
 * @property string|null $hero_title
 * @property string|null $hero_subtitle
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Setting extends Model
{
    /** @use HasFactory<SettingFactory> */
    use HasFactory;

    public const CACHE_KEY = 'settings.current';

    public const CACHE_MEMO_KEY = 'settings.current.instance';

    private const CACHE_TTL = 3600;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['site_name', 'logo_path', 'hero_title', 'hero_subtitle'];

    /**
     * The single site settings row, created on demand.
     *
     * Only the model's attributes are cached (never the model itself): the
     * cache config sets serializable_classes to false, so unserialized
     * objects come back as __PHP_Incomplete_Class. The cached value is
     * type-checked and rebuilt if it is not a valid attribute array. The
     * resolved instance is memoized in the app container so a request only
     * reads the cache once (e.g. once in HandleInertiaRequests and again in
     * a controller).
     */
    public static function current(): self
    {
        $memoized = app()->bound(self::CACHE_MEMO_KEY) ? app(self::CACHE_MEMO_KEY) : null;

        if ($memoized instanceof self) {
            return $memoized;
        }

        $cached = Cache::get(self::CACHE_KEY);

        if (is_array($cached)) {
            $settings = new self($cached);
            $settings->exists = true;
        } else {
            Cache::forget(self::CACHE_KEY);

            $settings = self::first() ?? self::create();

            Cache::put(self::CACHE_KEY, $settings->getAttributes(), self::CACHE_TTL);
        }

        app()->instance(self::CACHE_MEMO_KEY, $settings);

        return $settings;
    }

    /**
     * Drop the cached row and the per-request memo so the next call re-reads
     * the database. Called by the settings admin after saving.
     */
    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        app()->forgetInstance(self::CACHE_MEMO_KEY);
    }

    /**
     * The landing page headline, falling back to the default greeting.
     */
    public function heroTitle(): string
    {
        return $this->hero_title ?? 'Komunitas '.config('app.name');
    }

    /**
     * The landing page tagline, falling back to the default description.
     */
    public function heroSubtitle(): string
    {
        return $this->hero_subtitle ?? 'Ruang bersama bagi para pecinta otomotif untuk berbagi cerita, kegiatan, dan pengalaman.';
    }
}
