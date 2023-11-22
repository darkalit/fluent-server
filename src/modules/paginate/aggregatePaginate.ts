import { Document, Model, PipelineStage, Schema } from "mongoose";
import { QueryResult } from "./paginate.interfaces";

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  allowDiskUse?: boolean;
  limit?: number;
  page?: number;
}

function aggregatePaginate<T extends Document, U extends Model<U>>(
  schema: Schema<T>,
): void {
  schema.static(
    "aggregatePaginate",
    async function (
      query: PipelineStage[],
      options: IOptions,
    ): Promise<QueryResult> {
      let sort: string = "";
      if (options.sortBy) {
        const sortingCriteria: any = [];
        options.sortBy.split(",").forEach((sortOption: string) => {
          const [key, order] = sortOption.split(":");
          sortingCriteria.push((order === "desc" ? "-" : "") + key);
        });
        sort = sortingCriteria.join(" ");
      } else {
        sort = "createdAt";
      }

      let project: Record<string, any> = {};
      if (options.projectBy) {
        options.projectBy.split(",").forEach((projectOption: string) => {
          const [key, include] = projectOption.split(":");
          if (key) {
            project[key] = include === "hide" ? 0 : 1;
          }
        });
      } else {
        project = {
          createdAt: 0,
          updatedAt: 0,
        };
      }

      const limit = options.limit && parseInt(options.limit.toString(), 10) > 0
        ? parseInt(options.limit.toString(), 10)
        : 10;
      const page = options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1;
      const skip = (page - 1) * limit;

      let countPromise: any = this.aggregate(query).group({
        _id: null,
        count: {
          $sum: 1,
        },
      });

      let docsPromise: any = this.aggregate(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .project(project);

      if (options.allowDiskUse) {
        countPromise = countPromise.allowDiskUse(true);
        docsPromise = docsPromise.allowDiskUse(true);
      }

      countPromise = countPromise.exec();
      docsPromise = docsPromise.exec();

      return Promise.all([countPromise, docsPromise]).then((values) => {
        let [totalResults, results] = values;
        totalResults = totalResults[0] ? totalResults[0].count : 0;
        const totalPages = Math.ceil(totalResults / limit);

        let prev = null;
        let next = null;

        if (page > 1) prev = page - 1;
        if (page < totalPages) next = page + 1;

        const result = {
          results,
          page,
          prev,
          next,
          limit,
          totalPages,
          totalResults,
        };
        return Promise.resolve(result);
      });
    },
  );
}

export default aggregatePaginate;
