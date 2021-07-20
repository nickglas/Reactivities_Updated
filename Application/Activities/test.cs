using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class test
    {
        public class query : IRequest<List<Activity>>
        {
        }

        public class handler : IRequestHandler<query, List<Activity>>
        {
            public DataContext Context { get; }

            public handler(DataContext context)
            {
                this.Context = context;
            }

            public async Task<List<Activity>> Handle(query request, CancellationToken cancellationToken)
            {
                List<Activity> activities = await Context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}