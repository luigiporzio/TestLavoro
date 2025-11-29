using MediatR;
using System.Text;
using System.Xml.Linq;

namespace Backend.Features.Employees;

public class EmployeeExportQuery : IRequest<byte[]>
{
    public String? FirstName {get; set; }
    public String? LastName {get; set; }
}

internal class EmployeeExportQueryHandler(BackendContext context) : IRequestHandler<EmployeeExportQuery, byte[]>
{
    private readonly BackendContext context = context;

    public async Task<byte[]> Handle(EmployeeExportQuery request, CancellationToken cancellationToken)
    {
        var query = context.Employees.Include(e => e.Department).AsQueryable();

        if(!string.IsNullOrEmpty(request.FirstName))
        query = query.Where(e => e.FirstName.ToLower().Contains(request.FirstName.ToLower()));

        if(!string.IsNullOrEmpty(request.LastName))
        query = query.Where(e => e.LastName.ToLower().Contains(request.LastName.ToLower()));

        var data = await query.OrderBy(e => e.FirstName).ThenBy(e => e.LastName).ToListAsync(cancellationToken);

        XElement employees = new XElement("Employees",
        data.Select(e => new XElement("Employee", 
        new XElement("Code", e.Code),
        new XElement("FirstName",e.FirstName),
        new XElement("LastName", e.LastName),
        new XElement("Address", e.Address),
        new XElement("Phone", e.Phone),
        new XElement("Email", e.Email),
        new XElement("DepartmentCode", e.Department?.Code ?? ""),
        new XElement("Description", e.Department?.Description ?? "")
        ))
     );
     
        var employeesString = employees.ToString();

        return Encoding.UTF8.GetBytes(employeesString);
    }
}