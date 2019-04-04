﻿using HiveProject.Models;
using HiveProject.Viewmodels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace HiveProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {

       
        // GET: Admin
        public async Task<ActionResult> Index()
        {
            var users = new List<UsersViewModel>();
            using (var db = new ApplicationDbContext())
            {
                var role = await db.Roles.SingleAsync(y => y.Name == "Admin");
                users = await db.Users.Where(x => x.Email != "Admin@admin.com" && !x.Roles.Any(z => z.RoleId == role.Id))
                                 .Select(y => new UsersViewModel
                                 {
                                     Id = y.Id,
                                     Username = y.UserName,
                                     Thumbnail = y.Thumbnail,
                                     Age = y.Age,
                                     Gender = y.UserGender,
                                     Bio = y.Bio
                                 })
                                 .ToListAsync();
            }
            return View(users);
        }

        public async Task<ActionResult> Upgrade(string id)
        {
            using (var db = new ApplicationDbContext())
            {
                var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
                await manager.AddToRoleAsync(id, "Admin");
                await db.SaveChangesAsync();
            }
            return RedirectToAction("Index");
            
        }
    }
}