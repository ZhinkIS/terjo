<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Indonesian cities used to give seeded members a local touch.
     *
     * @var array<int, string>
     */
    private const CITIES = [
        'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang',
        'Yogyakarta', 'Malang', 'Denpasar', 'Makassar', 'Palembang',
        'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Solo',
        'Padang', 'Balikpapan', 'Pontianak', 'Manado', 'Pekanbaru',
    ];

    /**
     * The curated community members (1 owner, 3 admins, 30 members).
     *
     * @var array{owner: string, admins: array<int, string>, members: array<int, string>}
     */
    private const COMMUNITY = [
        'owner' => 'Arsyan Raditya',
        'admins' => [
            'Andhika Pratama',
            'Citra Maharani',
            'Dimas Anggara',
        ],
        'members' => [
            'Aditya Nugroho',
            'Aisyah Putri',
            'Bagas Saputra',
            'Bella Safitri',
            'Budi Santoso',
            'Dinda Ayu',
            'Fajar Ramadhan',
            'Fani Rahmawati',
            'Gilang Perdana',
            'Intan Permata',
            'Irfan Hakim',
            'Jasmine Anindita',
            'Kevin Wijaya',
            'Kirana Dewi',
            'Larasati Pramesti',
            'Made Wirawan',
            'Nadia Zahra',
            'Naufal Fikri',
            'Nindi Wulandari',
            'Putra Ramadhan',
            'Rahmat Hidayat',
            'Ratna Sari',
            'Reza Firmansyah',
            'Rizky Amelia',
            'Salsabila Azzahra',
            'Surya Kencana',
            'Tania Kusuma',
            'Taufik Hidayat',
            'Vina Oktaviani',
            'Yudha Saputra',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createUser(self::COMMUNITY['owner'], 'owner@terjocore.test', 'owner');

        foreach (self::COMMUNITY['admins'] as $index => $name) {
            $this->createUser($name, 'admin'.($index + 1).'@terjocore.test', 'admin');
        }

        foreach (self::COMMUNITY['members'] as $index => $name) {
            $this->createUser($name, 'member'.($index + 1).'@terjocore.test', 'member');
        }
    }

    private function createUser(string $name, string $email, string $role): void
    {
        $user = User::factory()->{'as'.Str::studly($role)}()->create([
            'name' => $name,
            'email' => $email,
            'status' => UserStatus::Approved,
            'bio' => fake()->paragraphs(2, true),
            'age' => fake()->numberBetween(19, 45),
            'location' => self::CITIES[array_rand(self::CITIES)],
            'profile_picture_url' => $this->generateAvatar($name),
        ]);

        $user->markEmailAsVerified();
    }

    private function generateAvatar(string $name): string
    {
        $initials = Str::upper(implode('', array_map(
            fn (string $part): string => mb_substr($part, 0, 1),
            explode(' ', trim($name)),
        )));

        $slug = Str::slug($name);
        $accent = $this->avatarAccent($slug);

        $svg = <<<SVG
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1b1b18"/>
            <circle cx="200" cy="200" r="150" fill="none" stroke="#C9A227" stroke-width="6"/>
            <text x="200" y="225" font-family="Georgia, serif" font-size="120" font-weight="bold" fill="#C9A227" text-anchor="middle">{$initials}</text>
            <text x="200" y="285" font-family="Georgia, serif" font-size="24" fill="#EDEDEC" text-anchor="middle" opacity="0.8">{$accent}</text>
        </svg>
        SVG;

        $directory = public_path('images/avatars');

        if (! File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $path = "images/avatars/{$slug}.svg";

        File::put(public_path($path), $svg);

        return '/'.$path;
    }

    private function avatarAccent(string $slug): string
    {
        $accents = ['EXCLUSIVE', 'COMMUNITY', 'TERJOCORE', 'PRIVATE'];

        return $accents[hexdec(substr(md5($slug), 0, 4)) % count($accents)];
    }
}
