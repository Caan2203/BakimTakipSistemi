using BakimAPI.Data;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;

namespace BakimAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> AddEmployee(Employee employee)
        {
            _context.Employees.Add(employee);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
                return BadRequest();

            _context.Entry(employee).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetEmployeeDetail(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Zimmetler)
                    .ThenInclude(z => z.Product)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return NotFound();

            return Ok(employee);
        }
        [HttpGet("excel")]
        public async Task<IActionResult> ExportExcel()
        {
            var employees = await _context.Employees.ToListAsync();

            using var workbook = new XLWorkbook();

            var ws = workbook.Worksheets.Add("Personeller");

            ws.Cell(1, 1).Value = "Ad";
            ws.Cell(1, 2).Value = "Soyad";
            ws.Cell(1, 3).Value = "Departman";
            ws.Cell(1, 4).Value = "Telefon";
            ws.Cell(1, 5).Value = "Mail";

            int row = 2;

            foreach (var item in employees)
            {
                ws.Cell(row, 1).Value = item.FirstName;
                ws.Cell(row, 2).Value = item.LastName;
                ws.Cell(row, 3).Value = item.Department;
                ws.Cell(row, 4).Value = item.Phone;
                ws.Cell(row, 5).Value = item.Email;

                row++;
            }

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Personeller.xlsx");
        }
    }
}