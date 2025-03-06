import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Transaction } from "../interfaces/transaction.interface";
import moment from "moment";
import { ModalContext } from "../context/modal.context";

const LineChart: FC<{}> = () => {
  const [dataSuccess, setDataSuccess] = useState<Transaction[]>([]);

  const { isLoading } = useContext(ModalContext);

  //--------------------------------------------------------------------------------
  const groupTransactionsByDateAndSum = (
    array: Transaction[],
    key: keyof Transaction
  ): Record<string, Transaction> => {
    return array.reduce((result, currentValue) => {
      const groupKey = currentValue[key] as string;

      if (!result[groupKey]) {
        result[groupKey] = { ...currentValue, amount: 0 };
      }

      if (result[groupKey] && currentValue.amount !== undefined) {
        result[groupKey].amount += currentValue.amount;
      }

      return result;
    }, {} as Record<string, Transaction>);
  };

  //--------------------------------------------------------------------------------
  const getDataPaidSuccess = async () => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("status", "==", "success")
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

        const formattedData = groupTransactionsByDateAndSum(
          dataList,
          "created_at"
        );

        setDataSuccess(Object.values(formattedData));
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  //--------------------------------------------------------------------------------
  const option: EChartsOption = useMemo(() => {
    const sortDataByDay = dataSuccess.sort((a, b) => {
      const dateA = moment(a.created_at, "ddd");
      const dateB = moment(b.created_at, "ddd");
      return dateA.diff(dateB);
    });
    return {
      xAxis: {
        type: "category",
        data: sortDataByDay.map((item) => item.created_at),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: sortDataByDay.map((item) => item.amount),
          type: "line",
          smooth: true,
        },
      ],
    };
  }, [dataSuccess]);

  //--------------------------------------------------------------------------------
  useEffect(() => {
    getDataPaidSuccess();
  }, [isLoading]);

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

export default LineChart;
