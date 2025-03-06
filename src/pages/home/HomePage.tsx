import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import BarRaceChart from "../../components/BarRaceChart";
import CardItem from "../../components/CardItem";
import LineChart from "../../components/LineChart";
import { AuthContext } from "../../context/auth.context";
import { Typography } from "@material-tailwind/react";
import TransactionsTable from "../../components/TransactionsTable";
import { Transaction } from "../../interfaces/transaction.interface";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
const HomePage: FC<{}> = () => {
  const { amount, totalPaidSuccess, totalPending } = useContext(AuthContext);

  const [data, setData] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>("");

  //--------------------------------------------------------------------------------
  const getTransactions = async (value?: string) => {
    try {
      let q = query(
        collection(db, "transactions"),
        orderBy("created_at", "desc")
      );

      if (value) {
        q = query(q, where("amount", "==", parseInt(value)));
      }

      await onSnapshot(q, (snapshot) => {
        const dataList = snapshot.docs.map((doc) => ({
          amount: doc.data().amount,
          processing_time: doc.data().processing_time.toDate().toLocaleString(),
          created_at: doc.data().created_at.toDate().toLocaleString(),
          status: doc.data().status,
        }));
        setData(dataList);
      });
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  //--------------------------------------------------------------------------------
  const onchangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  //--------------------------------------------------------------------------------
  const handleSearch = () => {
    if (search.trim() === "") {
      getTransactions();
    }
    getTransactions(search);
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <section className="w-full h-full">
      <div className="w-[80%]  mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        <CardItem
          title="Total Balance"
          content={amount?.amount_balance}
          color="green"
        />
        <CardItem title="Total Paid" content={totalPaidSuccess} color="red" />
        <CardItem title="Total Pending" content={totalPending} color="amber" />
      </div>
      <div className="container mx-auto w-full mt-6 grid grid-cols-1 sm:grid-cols-8 gap-3 p-4">
        <div className="col col-span-5 shadow-2xl border border-gray-700 rounded-lg p-4">
          <Typography style={{ fontSize: 24, fontWeight: 600 }} color="black">
            Cash flow
          </Typography>
          <div className="my-4">
            <Typography style={{ fontSize: 18, fontWeight: 600 }} color="black">
              Total transaction amount of user
            </Typography>
            <LineChart />
          </div>
          <div className="">
            <Typography style={{ fontSize: 18, fontWeight: 600 }} color="black">
              Successful and failed transaction rate.
            </Typography>
            <BarRaceChart />
          </div>
        </div>
        <div className="col col-span-3 grid grid-rows-3 ">
          <div className="row-span-2 shadow-2xl border border-gray-700 rounded-lg p-4">
            <TransactionsTable
              data={data}
              handleSearch={handleSearch}
              onchangeSearch={onchangeSearch}
              valueSearch={search}
            />
          </div>
          <></>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
