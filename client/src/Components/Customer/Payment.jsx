import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import Summary from "./Summary";
import { useNavigate } from "react-router-dom";
import { useDeleteBasketMutation, useGetBasketsUserQuery } from "../../Store/basketApiSlice";
import useAuth from "../Hooks/useAuth";
import { useCreateOrderMutation } from "../../Store/orderApiSlice";

const Payment = ({details, shipping }) => {

    const [products, setProducts] = useState([]);
    const [price, setPrice] = useState(0)
    const [DeleteBasket] = useDeleteBasketMutation()
    const { _id } = useAuth()
    const { data } = useGetBasketsUserQuery(_id)
    const Navigate = useNavigate()
    const [CreateOrder]= useCreateOrderMutation()


    useEffect(() => {
        if (data) {
            let sum = 0;
            const filteredProducts = [];

            data.items.forEach(product => {
                sum += (product.item.price) * (product.quantity);
                filteredProducts.push(product);
            });

            setProducts(filteredProducts);
            setPrice(sum);
        }
    }, [data]);

    const formik = useFormik({
        initialValues: {
            name: '',
            cardNumber: '',
            validity: '',
            cvv: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.cardNumber) {
                errors.cardNumber = 'שדה חובה';
            }

            if (!data.name) {
                errors.name = 'שדה חובה';
            }

            if (!data.validity) {
                errors.validity = 'שדה חובה';
            }

            if (!data.cvv) {
                errors.cvv = 'שדה חובה';
            }

            return errors;
        },
        onSubmit: () => {
            CreateOrder({
                user: data.user,
                items: products,
                dateOrder: new Date(),
                ordererName: details.name,
                email: details.email,
                phone: details.phone,
                city: details.city,
                street: details.street,
                num: details.num,
                apartment: details.apartment,
                price: price
            })
            DeleteBasket(data._id);
            formik.resetForm();
            Navigate("/");
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        <>
            <div className="warpper">
                <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                    <label htmlFor="name">שם בעל הכרטיס *</label>
                    <InputText
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={(e) => {
                            formik.setFieldValue('name', e.target.value);
                        }}
                        className={classNames({ 'p-invalid': isFormFieldInvalid('name') })}
                    />
                    {getFormErrorMessage('name')}


                    <label htmlFor="cardNumber">מספר כרטיס *</label>
                    <InputMask
                        id="cardNumber"
                        name="cardNumber"
                        value={formik.values.cardNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        mask="9999 9999 9999 9999"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('cardNumber') })}
                        dir="ltr"
                    />
                    {getFormErrorMessage('cardNumber')}

                    <label htmlFor="cardNumber">תוקף כרטיס *</label>
                    <InputMask
                        id="validity"
                        name="validity"
                        value={formik.values.validity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        mask="99/99"
                        slotChar="MM/YY"
                        className={classNames({ 'p-invalid': isFormFieldInvalid('validity') })}
                        dir="ltr"
                    />
                    {getFormErrorMessage('validity')}

                    <label htmlFor="cvv">3 ספרות בגב הכרטיס *</label>
                    <InputText
                        keyfilter="int"
                        id="cvv"
                        name="cvv"
                        value={formik.values.cvv}
                        placeholder="CVV"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        maxLength={3}
                        className={classNames({ 'p-invalid': isFormFieldInvalid('cvv') })}
                        dir="ltr"
                    />
                    {getFormErrorMessage('cvv')}


                    <Button type="submit" label="לביצוע התשלום" />
                </form>

                <Summary shipping={shipping} />
            </div>
        </>
    )
}

export default Payment
