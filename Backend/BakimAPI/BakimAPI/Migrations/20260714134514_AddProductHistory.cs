using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BakimAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductHistories_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_AssignedEmployeeId",
                table: "Products",
                column: "AssignedEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductHistories_ProductId",
                table: "ProductHistories",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Employees_AssignedEmployeeId",
                table: "Products",
                column: "AssignedEmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Employees_AssignedEmployeeId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "ProductHistories");

            migrationBuilder.DropIndex(
                name: "IX_Products_AssignedEmployeeId",
                table: "Products");
        }
    }
}
