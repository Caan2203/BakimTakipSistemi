using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakimAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddQrCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Maintenances");

            migrationBuilder.DropColumn(
                name: "NextMaintenanceDate",
                table: "Maintenances");

            migrationBuilder.RenameColumn(
                name: "MaintenanceType",
                table: "Maintenances",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "QrCode",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QrCode",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Maintenances",
                newName: "MaintenanceType");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Maintenances",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextMaintenanceDate",
                table: "Maintenances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
