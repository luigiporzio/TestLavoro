using MediatR;

namespace Backend.Features.Customers;

public class CustomerListQuery : IRequest<List<CustomerListQueryResponse>>
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class CustomerListQueryResponse
{
    public int Id { get; set; }
    public String Name { get; set; } = "";
    public String Address { get; set; } = "";
    public String Email { get; set; } = "";
    public String Phone { get; set; } = "";
    public String Iban { get; set; } = "";
    public String? CategoryCode { get; set; }
    public String? CategoryDescription { get; set; }

}

internal class CustomerListQueryHandler(BackendContext context) : IRequestHandler<CustomerListQuery, List<CustomerListQueryResponse>>
{
    private readonly BackendContext context = context;

    public async Task<List<CustomerListQueryResponse>> Handle(CustomerListQuery request, CancellationToken cancellationToken)
    {
        var query = context.Customers.Include(c => c.CustomerCategory).AsQueryable();

        if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(c => c.Name.ToLower().Contains(request.Name.ToLower()));

        if (!string.IsNullOrEmpty(request.Email))
            query = query.Where(c => c.Email.ToLower().Contains(request.Email.ToLower()));

        var data = await query.OrderBy(c => c.Name).ToListAsync(cancellationToken);

        var result = new List<CustomerListQueryResponse>();

        foreach(var item in data)
        {
            var resultItem = new CustomerListQueryResponse
            {
            Id = item.Id,
            Name = item.Name,
            Address = item.Address,
            Email = item.Email,
            Phone = item.Phone,
            Iban = item.Iban,
            
            CategoryCode = item.CustomerCategory?.Code,
            CategoryDescription = item.CustomerCategory?.Description
            };

            result.Add(resultItem);
        }
        return result;
    }
}