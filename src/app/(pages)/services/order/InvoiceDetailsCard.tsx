"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/orderPage.module.scss";
import { Button, Modal, TextInput } from "@/components";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/redux/hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditAddress } from "@/utils/schema";
import { updateAddress } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

const { invoiceSection } = styles;

const defaultValues = {
  fullName: "",
  companyName: "",
  country: "",
  state: "",
  address: "",
  city: "",
  zipCode: "",
};
const InvoiceDetailsCard = ({ order, user }: any) => {
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <section className={invoiceSection}>
        <header>
          <h4>Billing information</h4>

          <Button title="Edit" onClick={() => setIsOpenModal(true)} />
        </header>

        <div>
          <p>
            Your invoice will be issued according to the details listed here.
          </p>
          <br />
          <h4>
            {user?.address?.fullName || user?.name},{" "}
            {user?.address?.companyName}
          </h4>
          <p>
            {user?.address?.address}, {user?.address?.city},{" "}
            {user?.address?.state}, {user?.address?.country},{" "}
            {user?.address?.zipCode}
          </p>
        </div>
      </section>

      <Modal
        title={"Edit information for invoice"}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}>
        <FormInfo
          order={order}
          user={user}
          dispatch={dispatch}
          setIsOpenModal={setIsOpenModal}
        />
      </Modal>
    </>
  );
};

export default InvoiceDetailsCard;

const FormInfo = ({ order, user, dispatch, setIsOpenModal }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(EditAddress),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset({
      fullName: user?.address?.fullName || user?.name,
      companyName: user?.address?.companyName || "",
      country: user?.address?.country || "",
      state: user?.address?.state || "",
      address: user?.address?.address || "",
      city: user?.address?.city || "",
      zipCode: user?.address?.zipCode || "",
    });
  }, [user.address, user.name, reset]);

  const onSave = async (data: any) => {
    setLoading(true);

    const { payload } = await dispatch(
      updateAddress({ _id: user._id, ...data })
    );

    if (payload.success) {
      const latestOrder = {
        ...order,
        userId: user._id,
        user: user,
      };
      localStorage.setItem("latestOrder", JSON.stringify(latestOrder));

      toast.success(payload.message);
      setLoading(false);
      setIsOpenModal(false);
    } else {
      toast.error(payload.error || "Address failed");
      setError(payload.error);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSave)}>
        <TextInput
          label="Full name (mandatory)"
          placeholder="Enter full name"
          control={control}
          name="fullName"
          error={errors.fullname}
        />

        <TextInput
          label="Company name"
          placeholder="Enter Company name"
          control={control}
          name="companyName"
          error={errors.companyName}
        />

        <TextInput
          label="Country"
          placeholder="Enter country"
          control={control}
          name="country"
          error={errors.country}
        />

        <TextInput
          label="State/Union territory(mandatory)"
          placeholder="Enter State"
          control={control}
          name="state"
          error={errors.state}
        />

        <TextInput
          label="Address"
          placeholder="Enter address"
          control={control}
          name="address"
          error={errors.address}
        />

        <TextInput
          label="City"
          placeholder="Enter city"
          control={control}
          name="city"
          error={errors.city}
        />

        <TextInput
          label="Postal code"
          placeholder="Enter postal code"
          control={control}
          name="zipCode"
          error={errors.zipCode}
        />

        {error && <p>{error}</p>}

        <Button
          title="Save"
          type="submit"
          disabled={loading}
          loading={loading}
          wrapperStyle={{ marginTop: 30 }}
        />
      </form>
    </div>
  );
};
