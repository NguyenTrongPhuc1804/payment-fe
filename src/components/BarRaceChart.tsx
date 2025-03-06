import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { ChartItem } from "../interfaces/chart.interface";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import moment from "moment";
import { Transaction } from "../interfaces/transaction.interface";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/auth.context";

const BarRaceChart: FC<{}> = () => {
  const { setTotalPaidSuccess, setTotalPending } = useContext(AuthContext);

  //--------------------------------------------------------------------------------
  const [dataSuccess, setDataSuccess] = useState<Transaction[]>([]);
  const [dataPending, setDataPending] = useState<Transaction[]>([]);

  //--------------------------------------------------------------------------------
  const data: ChartItem[] = useMemo(() => {
    return [
      {
        value: dataSuccess[0]?.amount,
        itemStyle: {
          color: "green",
        },
      },
      {
        value: dataPending[0]?.amount,
        itemStyle: {
          color: "yellow",
        },
      },
    ];
  }, [dataSuccess, dataPending]);

  //--------------------------------------------------------------------------------
  const groupTransactionsByStatusAndSum = (
    array: Transaction[],
    key: keyof Transaction
  ): Record<string, Transaction> => {
    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key] as string;

      if (!result[groupKey]) {
        result[groupKey] = { status: currentValue.status, amount: 0 };
      }

      if (result[groupKey] && currentValue.amount !== undefined) {
        result[groupKey].amount += currentValue.amount;
      }

      return result;
    }, {} as Record<string, Transaction>);
  };

  //--------------------------------------------------------------------------------
  const getDataPaidSuccess = async (status: string) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("status", "==", status)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataList = querySnapshot.docs.map((doc) => {
          const { amount, processing_time, created_at, status } = doc.data();
          return {
            amount,
            processing_time: processing_time.toDate().toLocaleString(),
            created_at: moment(created_at.toDate().toLocaleString()).format(
              "ddd"
            ),
            status: status,
          };
        });

        const formattedData = groupTransactionsByStatusAndSum(
          dataList,
          "status"
        );

        if (status === "success") {
          setDataSuccess(Object.values(formattedData));
          setTotalPaidSuccess?.(Object.values(formattedData)[0].amount);
        } else {
          setDataPending(Object.values(formattedData));
          setTotalPending?.(Object.values(formattedData)[0].amount);
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  const option: EChartsOption = {
    xAxis: {
      max: "dataMax",
    },
    yAxis: {
      type: "category",
      data: ["success", "pending", "C", "D", "E"],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      max: 2,
    },
    series: [
      {
        realtimeSort: true,
        name: "success",
        color: "green",
        type: "bar",
        data: data,
        label: {
          show: true,
          position: "right",
          valueAnimation: true,
        },
      },
    ],
    legend: {
      show: true,
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: "linear",
    animationEasingUpdate: "linear",
  };

  useEffect(() => {
    getDataPaidSuccess("success");
    getDataPaidSuccess("pending");
  }, []);
  return (
    <div>
      <ReactECharts
        option={option}
        style={{ height: "400px", width: "100%" }}
        className="react_for_echarts"
      />
    </div>
  );
};

export default BarRaceChart;
