using MediatR;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Backend.Features.Customers;

public class CustomerExportQuery : IRequest<byte[]>
{
    public String? Name { get; set; }
    public String? Email { get; set; }
}

internal class CustomerExportQueryHandler(BackendContext context) : IRequestHandler<CustomerExportQuery, byte[]>
{
    private readonly BackendContext context = context;

    public async Task<byte[]> Handle(CustomerExportQuery request, CancellationToken cancellationToken)
    {
        var query = context.Customers.Include(c => c.CustomerCategory).AsQueryable();

        if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(c => c.Name.ToLower().Contains(request.Name.ToLower()));

        if (!string.IsNullOrEmpty(request.Email))
            query = query.Where(c => c.Email.ToLower().Contains(request.Email.ToLower()));

        var data = await query.OrderBy(c => c.Name).ToListAsync(cancellationToken);

        XElement customers = new XElement("Customers",
            data.Select(c => new XElement("Customer", 
            new XElement("Id", c.Id),
            new XElement("Name", c.Name),
            new XElement("Address", c.Address),
            new XElement("Email", c.Email),
            new XElement("Phone", c.Phone),
            new XElement("Iban", c.Iban),
            new XElement("CategoryCode", c.CustomerCategory?.Code ?? ""),
            new XElement("CategoryDescription", c.CustomerCategory?.Description ?? "")
            )
        ) 
    );

        var customersString = customers.ToString();

        return Encoding.UTF8.GetBytes(customersString);
    }
}
