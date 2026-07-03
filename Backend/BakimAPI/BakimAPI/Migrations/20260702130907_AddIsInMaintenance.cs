using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakimAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddIsInMaintenance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsInMaintenance",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsInMaintenance",
                table: "Products");
        }
    }
}
