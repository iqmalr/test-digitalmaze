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
        Schema::table('student_parents', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
        });
        Schema::create('student_parent_student', function (Blueprint $table) {
            $table->uuid('student_id');
            $table->uuid('parent_id');
            $table->timestamps();

            $table->primary(['student_id', 'parent_id']);

            $table->foreign('student_id')->references('id')->on('m_students')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('student_parents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_parent_student');
    }
};
