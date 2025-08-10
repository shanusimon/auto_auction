import { IGetDashboardRevenueUseCase } from "../../entities/useCaseInterfaces/admin/IGetDashboardRevenue";
import moment from "moment";

import { IAdminWalletRepository } from "../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository";
import { injectable, inject } from "tsyringe";

@injectable()
export class getDashBoardRevenueUseCase implements IGetDashboardRevenueUseCase {
  constructor(
    @inject("IAdminWalletRepository")
    private _adminWallet: IAdminWalletRepository
  ) {}
  async execute(period: string): Promise<{ name: string; revenue: number }[]> {
    const wallet = await this._adminWallet.findSingle();
    if (!wallet || !wallet.transaction) {
      return [];
    }

    let startDate: moment.Moment, endDate: moment.Moment;
    if (period === "weekly") {
      startDate = moment().subtract(4, "weeks").startOf("week");
      endDate = moment().endOf("week");
    } else if (period === "monthly") {
      startDate = moment().subtract(6, "months").startOf("month");
      endDate = moment().endOf("month");
    } else {
      startDate = moment().subtract(5, "years").startOf("year");
      endDate = moment().endOf("year");
    }
    const transactions = wallet.transaction.filter((tx: any) => {
      const txDate = moment(tx.timeStamp);
      return txDate.isBetween(startDate, endDate, null, "[]");
    });

    let aggregatedData: { name: string; revenue: number }[] = [];
    if (period === "weekly") {
      const weeks: { [key: string]: number } = {};

      for (let i = 0; i < 4; i++) {
        const weekStart = moment(startDate).add(i, "weeks").startOf("week");
        const weekNum = weekStart.week();
        const year = weekStart.year();
        const key = `Week ${i + 1} ${year}`;
        weeks[key] = 0;
      }
      transactions.forEach((tx: any) => {
        const date = moment(tx.timeStamp);
        const weekNum = date.week();
        const year = date.year();
        const weekIndex = Math.floor(date.diff(startDate, "weeks") + 1);
        const key = `Week ${weekIndex} ${year}`;
        weeks[key] = (weeks[key] || 0) + tx.commissionAmount;
      });
      aggregatedData = Object.keys(weeks).map((key) => ({
        name: key,
        revenue: weeks[key],
      }));
    } else if (period === "monthly") {
      const months: { [key: string]: number } = {};

      for (let i = 0; i < 6; i++) {
        const month = moment(startDate).add(i, "months").format("MMM");
        const year = moment(startDate).add(i, "months").year();
        const key = `${month} ${year}`;
        months[key] = 0;
      }
      transactions.forEach((tx: any) => {
        const date = moment(tx.timeStamp);
        const key = date.format("MMM YYYY");
        months[key] = (months[key] || 0) + tx.commissionAmount;
      });
      aggregatedData = Object.keys(months).map((key) => ({
        name: key,
        revenue: months[key],
      }));
    } else {
      const years: { [key: string]: number } = {};
      for (let i = 0; i < 5; i++) {
        const year = moment(startDate).add(i, "years").year();
        years[year] = 0;
      }
      transactions.forEach((tx: any) => {
        const date = moment(tx.timeStamp);
        const key = date.year().toString();
        years[key] = (years[key] || 0) + tx.commissionAmount;
      });
      aggregatedData = Object.keys(years).map((key) => ({
        name: key,
        revenue: years[key],
      }));
    }

    aggregatedData.sort((a, b) => {
      const dateA = moment(
        a.name,
        period === "weekly"
          ? "Week W YYYY"
          : period === "monthly"
          ? "MMM YYYY"
          : "YYYY"
      );
      const dateB = moment(
        b.name,
        period === "weekly"
          ? "Week W YYYY"
          : period === "monthly"
          ? "MMM YYYY"
          : "YYYY"
      );
      return dateA.valueOf() - dateB.valueOf();
    });

    return aggregatedData;
  }
}
