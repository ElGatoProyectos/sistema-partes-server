<!-- controller -->

findAll = async (request: Request, response: Response) => {
const ruc = request.get("ruc") as string;
const page = parseInt(request.query.page as string) || 1;
const limit = parseInt(request.query.limit as string) || 20;
const status_group = request.query.status_group as string;
const nameFilter = request.query.name as string;
const result = await this.supplierService.findAll(
ruc,
page,
limit,
nameFilter,
status_group
);
response.status(result.statusCode).json(result);
};

<!-- servicio -->

findAll = async (
ruc: string,
page: number,
limit: number,
nameFilter?: string,
status_group?: string
) => {
const skip = (page - 1) \* limit;
try {
const responseCompany = await this.getCompanyInitial(ruc);
if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      //[message] inicializamos los filtros

      const filters: any = {
        status_deleted: false,
        company_id: company.id,
      };

      //[message] seteamos los filtros que necesitamos

      if (nameFilter) {
        if (validator.isNumeric(nameFilter)) {
          filters.ruc = {
            contains: nameFilter,
            mode: "insensitive",
          };
        } else {
          filters.business_name = {
            contains: nameFilter,
            mode: "insensitive",
          };
        }
      }
      // [message] filtros por el grupo de id's
      if (status_group) {
        const status = status_group.split(",").map(String);
        filters.business_status = {
          in: status,
        };
      }

      const [suppliers, total] = await prisma.$transaction([
        prisma.supplier.findMany({
          where: filters,
          orderBy: { id: "desc" },
          skip,
          take: limit,
        }),
        prisma.supplier.count({
          where: filters,
        }),
      ]);

      const pageCount = Math.ceil(total / limit);

      const formatData = {
        total,
        page,
        limit,
        pageCount,
        data: suppliers,
      };

      return this.responseService.SuccessResponse(
        "Lista de Proveedores",
        formatData
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }

};
