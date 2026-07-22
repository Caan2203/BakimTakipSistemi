using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakimAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddLastLoginToKullanici : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogin",
                table: "Kullanicilar",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordChangedDate",
                table: "Kullanicilar",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLogin",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "PasswordChangedDate",
                table: "Kullanicilar");
        }
    }
}
