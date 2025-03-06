import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FC, useContext, useEffect } from "react";
import { ModalContext } from "../context/modal.context";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { color } from "@material-tailwind/react/types/components/alert";

const CardItem: FC<{ title: string; content?: number; color?: color }> = (
  props
) => {
  const { title, content, color = "blue-gray" } = props;

  return (
    <Card className="mt-6 w-auto m-1 md:m-4 border-solid border-2 border-gray-200">
      <CardBody>
        <div className="flex  text-center">
          <CurrencyDollarIcon className="size-6 text-gray-500" />
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {title}
          </Typography>
        </div>
        <Typography style={{ fontSize: "20px" }} color={color}>
          $ {content?.toLocaleString()}
        </Typography>
      </CardBody>
    </Card>
  );
};

export default CardItem;
