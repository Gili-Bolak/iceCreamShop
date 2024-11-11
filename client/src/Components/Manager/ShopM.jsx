import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useDeleteItemMutation, useGetAllItemQuery, useUpdateItemMutation } from '../../Store/itemApiSlice'
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import '../../CSS/Item.css'
import Swal from 'sweetalert2';


const ShopM = () => {

    const [item, setItem] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [updateItem, setUpdateItem] = useState(null)


    const [descriptionUpdate, setDescriptionUpdate] = useState("");
    const [stockUpdate, setStockUpdate] = useState("");
    const [priceUpdate, setPriceUpdate] = useState("");
    const [imgUrlUpdate, setImgUrlUpdate] = useState("");


    const [priceDisabledUpdate, setPriceDisabledUpdate] = useState(false);

    const { data, isLoading, isError, error } = useGetAllItemQuery()


    const handleUpdateImage = (event) => {
        setImgUrlUpdate(event.target.files[0]);
    };

    const [deleteFunc] = useDeleteItemMutation()
    const handleDeleteClick = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "?that you want to delete this item",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes I want to delete"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFunc(item._id)

                Swal.fire({
                    title: "!Deleted",
                    text: "This item has been deleted",
                    icon: "success"
                });
            }
        });
    }

    const [updateFunc] = useUpdateItemMutation()
    const handleUpdateClick = (item) => {
        const formData = new FormData()

        formData.append("_id", item._id)
        formData.append("description", descriptionUpdate)
        formData.append("stock", stockUpdate)
        formData.append("price", priceUpdate)
        formData.append("image", imgUrlUpdate)

        updateFunc(formData)
    }


    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const footerContentUpdate = (
        <div>
            <Button disabled={priceDisabledUpdate} label="עדכון" onClick={() => {
                setVisibleUpdate(false);
                handleUpdateClick(updateItem)
                setUpdateItem(null)
            }} autoFocus />
            <Button label="ביטול" onClick={() => {
                setPriceDisabledUpdate(false)
                setUpdateItem(null)
                setVisibleUpdate(false);
            }} className="p-button-text" />
        </div>
    );



    useEffect(() => {
        if (data) {
            setItem(data);
        }
    }, [data]);

    if (isLoading) {
        return <h1>Loading</h1>
    }
    if (isError) {
        return <h2>{error}</h2>
    }


    const listItem = (item, index) => {
        return (
            <div className="col-12" key={item.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`http://localhost:8050/uploads/${item?.image?.split("\\")[2]}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">קוד מוצר: {item.code}</div>
                            <div className="text-2xl font-bold text-900">{item.description}</div>
                            <div className="text-1xl font-bold text-900">המלאי עומד על: {item.stock}</div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{item.price} ₪</span>
                            <Button onClick={() => { handleDeleteClick(item) }} icon="pi pi-trash" rounded outlined aria-label="Filter" />
                            <Button icon="pi pi-pencil" rounded outlined aria-label="Filter" onClick={() => {
                                setVisibleUpdate(true);
                                setUpdateItem(item);
                                setDescriptionUpdate(item.description);
                                setStockUpdate(item.stock);
                                setPriceUpdate(item.price);
                                setImgUrlUpdate(item.imgUrl);
                            }} />

                            <Dialog header="עריכת פרוזן" visible={visibleUpdate} style={{ width: '50vw' }} onHide={() => setVisibleUpdate(false)} footer={footerContentUpdate}>
                                <p className="m-0">
                                    <br />

                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputText
                                                keyfilter="int"
                                                value={priceUpdate}
                                                onChange={(e) => {
                                                    setPriceDisabledUpdate(!e.target.value.trim())
                                                    setPriceUpdate(e.target.value)
                                                }}
                                            />
                                            <label htmlFor="מחיר">מחיר*</label>
                                        </span>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputText keyfilter="int" value={stockUpdate} onChange={(e) => setStockUpdate(e.target.value)} />
                                            <label htmlFor="מלאי">מלאי</label>
                                        </span>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputTextarea value={descriptionUpdate} onChange={(e) => setDescriptionUpdate(e.target.value)} rows={4} cols={23} />
                                            <label htmlFor="תיאור מוצר">תיאור מוצר</label>
                                        </span>
                                    </div>

                                    <br />
                                    <input type="file" name="image" onChange={handleUpdateImage} />
                                </p>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (item) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={item.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`http://localhost:8050/uploads/${item?.image?.split("\\")[2]}`} alt={item.name} />
                        <div className="text-2xl font-bold text-900">קוד מוצר: {item.code}</div>
                        <div className="gridDescription">{item.description}</div>
                        <div className="text-1xl font-bold text-900">המלאי עומד על: {item.stock}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{item.price} ₪</span>
                        <span className='icons'>
                            <Button onClick={() => { handleDeleteClick(item) }} icon="pi pi-trash" rounded outlined aria-label="Filter" />
                            <Button icon="pi pi-pencil" rounded outlined aria-label="Filter" onClick={() => {
                                setVisibleUpdate(true);
                                setUpdateItem(item);
                                setDescriptionUpdate(item.description);
                                setStockUpdate(item.stock);
                                setPriceUpdate(item.price);
                                setImgUrlUpdate(item.imgUrl);
                            }} />

                            <Dialog header="עריכת פרוזן" visible={visibleUpdate} style={{ width: '50vw' }} onHide={() => setVisibleUpdate(false)} footer={footerContentUpdate}>
                                <p className="m-0">
                                    <br />

                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputText
                                                keyfilter="int"
                                                value={priceUpdate}
                                                onChange={(e) => {
                                                    setPriceDisabledUpdate(!e.target.value.trim())
                                                    setPriceUpdate(e.target.value)
                                                }}
                                            />
                                            <label htmlFor="מחיר">מחיר*</label>
                                        </span>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputText keyfilter="int" value={stockUpdate} onChange={(e) => setStockUpdate(e.target.value)} />
                                            <label htmlFor="מלאי">מלאי</label>
                                        </span>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="dialogInput">
                                        <span className="p-float-label">
                                            <InputTextarea value={descriptionUpdate} onChange={(e) => setDescriptionUpdate(e.target.value)} rows={4} cols={23} />
                                            <label htmlFor="תיאור מוצר">תיאור מוצר</label>
                                        </span>
                                    </div>

                                    <br />
                                    <input type="file" name="image" onChange={handleUpdateImage} />
                                </p>
                            </Dialog>
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (item, layout, index) => {
        if (!item) {
            return;
        }

        if (layout === 'list') return listItem(item, index);
        else if (layout === 'grid') return gridItem(item);
    };

    const listTemplate = (item, layout) => {
        return <div className="grid grid-nogutter">{item.map((item, index) => itemTemplate(item, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="headerManager">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        <>
            <div>
                <DataView value={item} listTemplate={listTemplate} layout={layout} header={header()} />
            </div>
        </>
    )
}

export default ShopM

