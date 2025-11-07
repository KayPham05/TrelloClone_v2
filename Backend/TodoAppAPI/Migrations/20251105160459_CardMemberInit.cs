using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoAppAPI.Migrations
{
    /// <inheritdoc />
    public partial class CardMemberInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardMember_Cards_CardUId1",
                table: "CardMember");

            migrationBuilder.DropForeignKey(
                name: "FK_CardMember_Users_UserUId1",
                table: "CardMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CardMember",
                table: "CardMember");

            migrationBuilder.DropIndex(
                name: "IX_CardMember_CardUId1",
                table: "CardMember");

            migrationBuilder.DropIndex(
                name: "IX_CardMember_UserUId1",
                table: "CardMember");

            migrationBuilder.DropColumn(
                name: "CardUId1",
                table: "CardMember");

            migrationBuilder.DropColumn(
                name: "UserUId1",
                table: "CardMember");

            migrationBuilder.RenameTable(
                name: "CardMember",
                newName: "CardMembers");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "CardMembers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Assignee",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<DateTime>(
                name: "AssignedAt",
                table: "CardMembers",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardMembers",
                table: "CardMembers",
                column: "CardMemberUId");

            migrationBuilder.CreateIndex(
                name: "IX_CardMembers_CardUId_UserUId",
                table: "CardMembers",
                columns: new[] { "CardUId", "UserUId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardMembers_UserUId",
                table: "CardMembers",
                column: "UserUId");

            migrationBuilder.AddForeignKey(
                name: "FK_CardMembers_Cards_CardUId",
                table: "CardMembers",
                column: "CardUId",
                principalTable: "Cards",
                principalColumn: "CardUId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CardMembers_Users_UserUId",
                table: "CardMembers",
                column: "UserUId",
                principalTable: "Users",
                principalColumn: "UserUId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardMembers_Cards_CardUId",
                table: "CardMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_CardMembers_Users_UserUId",
                table: "CardMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CardMembers",
                table: "CardMembers");

            migrationBuilder.DropIndex(
                name: "IX_CardMembers_CardUId_UserUId",
                table: "CardMembers");

            migrationBuilder.DropIndex(
                name: "IX_CardMembers_UserUId",
                table: "CardMembers");

            migrationBuilder.RenameTable(
                name: "CardMembers",
                newName: "CardMember");

            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "CardMember",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldDefaultValue: "Assignee");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AssignedAt",
                table: "CardMember",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CardUId1",
                table: "CardMember",
                type: "nvarchar(128)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserUId1",
                table: "CardMember",
                type: "nvarchar(128)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardMember",
                table: "CardMember",
                column: "CardMemberUId");

            migrationBuilder.CreateIndex(
                name: "IX_CardMember_CardUId1",
                table: "CardMember",
                column: "CardUId1");

            migrationBuilder.CreateIndex(
                name: "IX_CardMember_UserUId1",
                table: "CardMember",
                column: "UserUId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CardMember_Cards_CardUId1",
                table: "CardMember",
                column: "CardUId1",
                principalTable: "Cards",
                principalColumn: "CardUId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CardMember_Users_UserUId1",
                table: "CardMember",
                column: "UserUId1",
                principalTable: "Users",
                principalColumn: "UserUId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
