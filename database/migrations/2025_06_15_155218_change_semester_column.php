<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('m_classes', function (Blueprint $table) {
            $table->enum('semester', ['1', '2'])->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('m_classes', function (Blueprint $table) {
            $table->enum('semester', ['1', '2'])->nullable(false)->change();
        });
    }
};
