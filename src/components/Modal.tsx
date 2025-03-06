import React, { FC, useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Card,
} from "@material-tailwind/react";
import { ModalContext } from "../context/modal.context";
import { AuthContext } from "../context/auth.context";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { toast } from "react-toastify";

const ModalDefault: FC<{
  open: boolean;
  handleOpen: () => void;
}> = (props) => {
  const { open, handleOpen } = props;
  const { profile, amount } = useContext(AuthContext);
  const { setIsLoading } = useContext(ModalContext);

  //--------------------------------------------------------------------------------
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const notify = () => toast.success("Payment successful!");

  //--------------------------------------------------------------------------------
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToPay(Number(e.target.value));
  };

  //--------------------------------------------------------------------------------
  const fakeProcessingPayment = async (
    newTransaction: DocumentReference<DocumentData, DocumentData>
  ) => {
    // fake processing time after 5 seconds
    setTimeout(() => {
      if (amount) {
        try {
          const itemRef = doc(db, "transactions", newTransaction.id);
          updateDoc(itemRef, {
            status: "success",
            processing_time: new Date(),
          });
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
      toast.success("processed successfully! ");
    }, 5000);
  };

  //--------------------------------------------------------------------------------
  const handleSubmit = async () => {
    if (amount?.amount_balance) {
      if (amountToPay > amount?.amount_balance) {
        alert("Insufficient funds");
        return;
      }
    }

    const payload = {
      amount: amountToPay,
      created_at: new Date(),
      processing_time: new Date(),
      status: "pending",
      user_id: profile?.uid,
    };
    setIsLoading?.(true);
    try {
      const newTransaction = await addDoc(
        collection(db, "transactions"),
        payload
      );

      if (amount) {
        const itemRef = doc(db, "users", "6ZbyJ6qbPU8wXUPgOVFS");
        await updateDoc(itemRef, {
          amount_balance: increment(-amountToPay),
          total_paid: increment(amountToPay),
        });
      }

      handleOpen();
      notify();
      setIsLoading?.(false);

      // fake processing time after 5 seconds
      fakeProcessingPayment(newTransaction);
    } catch (e) {
      console.error("Error adding document: ", e);
      setIsLoading?.(false);
    }
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>New payment.</DialogHeader>
        <DialogBody>
          <Card color="transparent" shadow={false}>
            <form
              onSubmit={handleSubmit}
              className="mt-8 mb-2 w-80 mx-auto  max-w-screen-lg sm:w-96"
            >
              <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-3">
                  Your Email
                </Typography>
                <Input
                  size="lg"
                  value={profile?.email}
                  disabled
                  label="Amount to pay"
                  placeholder={profile?.email}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <Input
                  onChange={(e) => handleChangeAmount(e)}
                  type="number"
                  inputMode="numeric"
                  label="Amount to pay"
                  className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <div className="">
                <p className="text-sm text-gray-500">
                  available balance: ${amount?.amount_balance}
                </p>
              </div>
            </form>
          </Card>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ModalDefault;
