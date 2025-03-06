import TransactionsTable from "../../components/TransactionsTable";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Transaction } from "../../interfaces/transaction.interface";

const AccountPage: FC<{}> = () => {
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

  //--------------------------------------------------------------------------------
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="container mx-auto mt-4">
      <TransactionsTable
        data={data}
        handleSearch={handleSearch}
        onchangeSearch={onchangeSearch}
        valueSearch={search}
      />
    </div>
  );
};

export default AccountPage;
