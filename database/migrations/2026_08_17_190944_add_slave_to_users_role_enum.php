<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            // Drop existing check constraint, alter type, re-add with slave.
            $table = 'users';
            $column = 'role';

            $constraints = DB::select("
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = '\"{$table}\"'::regclass
                  AND contype = 'c'
                  AND pg_get_constraintdef(oid) LIKE '%{$column}%'
            ");

            foreach ($constraints as $c) {
                DB::statement("ALTER TABLE \"{$table}\" DROP CONSTRAINT \"{$c->conname}\"");
            }

            DB::statement("ALTER TABLE \"{$table}\" ALTER COLUMN \"{$column}\" TYPE varchar(255)");
            DB::statement("ALTER TABLE \"{$table}\" ADD CONSTRAINT \"{$table}_{$column}_check\" CHECK (\"{$column}\" IN ('owner', 'admin', 'member', 'slave'))");
        } else {
            Schema::table('users', function ($table) {
                $table->enum('role', ['owner', 'admin', 'member', 'slave'])->default('member')->change();
            });
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            $table = 'users';
            $column = 'role';

            $constraints = DB::select("
                SELECT conname
                FROM pg_constraint
                WHERE conrelid = '\"{$table}\"'::regclass
                  AND contype = 'c'
                  AND pg_get_constraintdef(oid) LIKE '%{$column}%'
            ");

            foreach ($constraints as $c) {
                DB::statement("ALTER TABLE \"{$table}\" DROP CONSTRAINT \"{$c->conname}\"");
            }

            DB::statement("ALTER TABLE \"{$table}\" ALTER COLUMN \"{$column}\" TYPE varchar(255)");
            DB::statement("ALTER TABLE \"{$table}\" ADD CONSTRAINT \"{$table}_{$column}_check\" CHECK (\"{$column}\" IN ('owner', 'admin', 'member'))");
        } else {
            Schema::table('users', function ($table) {
                $table->enum('role', ['owner', 'admin', 'member'])->default('member')->change();
            });
        }
    }
};
