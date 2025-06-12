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
        Schema::create('m_teachers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('nip')->nullable();
            $table->string('address');
            $table->date('date_of_birth');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_teachers');
    }
};
