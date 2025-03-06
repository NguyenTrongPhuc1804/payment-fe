import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Input,
} from "@material-tailwind/react";
import { ChangeEvent, FC, useContext, useEffect } from "react";
import { ModalContext } from "../context/modal.context";
import { Transaction } from "../interfaces/transaction.interface";

const TABLE_HEAD = ["Amount", "Date", "Status"];

const TransactionsTable: FC<{
  data: Transaction[];
  handleSearch: () => void;
  onchangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  valueSearch: string;
}> = (props) => {
  const { data, handleSearch, onchangeSearch, valueSearch } = props;

  const { handleOpen } = useContext(ModalContext);

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col gap-8 md:flex-col ">
          <div className="w-full">
            <Typography variant="h5" color="blue-gray">
              Recent Transactions
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the last transactions
            </Typography>
          </div>
          <div className="flex flex-col w-full shrink-0 gap-2   ">
            <div className="w-full ">
              <Input
                label="Search by amount"
                type="number"
                inputMode="numeric"
                onChange={onchangeSearch}
                value={valueSearch}
                icon={
                  <MagnifyingGlassIcon
                    onClick={handleSearch}
                    className="h-5 w-5 cursor-pointer hover:text-red-500"
                  />
                }
              />
            </div>
            <Button onClick={handleOpen}> Create payment </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0 h-[500px]">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(({ amount, status, created_at }, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      $ {amount}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {created_at}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={status}
                        color={
                          status === "success"
                            ? "green"
                            : status === "pending"
                            ? "amber"
                            : "red"
                        }
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <p></p>
      </CardFooter>
    </Card>
  );
};

export default TransactionsTable;
