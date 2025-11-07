using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoAppAPI.Migrations
{
    /// <inheritdoc />
    public partial class CardMember : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CardMember",
                columns: table => new
                {
                    CardMemberUId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    CardUId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    CardUId1 = table.Column<string>(type: "nvarchar(128)", nullable: false),
                    UserUId = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    UserUId1 = table.Column<string>(type: "nvarchar(128)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardMember", x => x.CardMemberUId);
                    table.ForeignKey(
                        name: "FK_CardMember_Cards_CardUId1",
                        column: x => x.CardUId1,
                        principalTable: "Cards",
                        principalColumn: "CardUId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardMember_Users_UserUId1",
                        column: x => x.UserUId1,
                        principalTable: "Users",
                        principalColumn: "UserUId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CardMember_CardUId1",
                table: "CardMember",
                column: "CardUId1");

            migrationBuilder.CreateIndex(
                name: "IX_CardMember_UserUId1",
                table: "CardMember",
                column: "UserUId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CardMember");
        }
    }
}
