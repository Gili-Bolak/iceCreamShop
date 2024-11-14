import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useAddItemMutation, useDeleteItemMutation, useGetItemByCategoryQuery, useUpdateItemMutation } from '../../Store/itemApiSlice'
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from 'primereact/toast';
import '../../CSS/Item.css'
import Swal from 'sweetalert2';


const YogurtsM = () => {

    const toast = useRef(null);

    const [yogurts, setYogurts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [updateyogurt, setUpdateyogurt] = useState(null)

    const [codeAdd, setCodeAdd] = useState("");
    const [descriptionAdd, setDescriptionAdd] = useState("");
    const [priceAdd, setPriceAdd] = useState("");
    const [imgUrlAdd, setImgUrlAdd] = useState("");

    const [descriptionUpdate, setDescriptionUpdate] = useState("");
    const [priceUpdate, setPriceUpdate] = useState("");
    const [imgUrlUpdate, setImgUrlUpdate] = useState("");

    const [codeDisabled, setCodeDisabled] = useState(true);
    const [priceDisabled, setPriceDisabled] = useState(true);

    const [priceDisabledUpdate, setPriceDisabledUpdate] = useState(false);

    const { data, isLoading, isError, error } = useGetItemByCategoryQuery("yogurt")

    const handleAddImage = (event) => {
        setImgUrlAdd(event.target.files[0]);
    };

    const handleUpdateImage = (event) => {
        setImgUrlUpdate(event.target.files[0]);
    };

    const [deleteFunc] = useDeleteItemMutation()
    const handleDeleteClick = (yogurt) => {
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
                deleteFunc(yogurt._id)

                Swal.fire({
                    title: "!Deleted",
                    text: "This item has been deleted",
                    icon: "success"
                });
            }
        });
    }

    const [updateFunc] = useUpdateItemMutation()
    const handleUpdateClick = (yogurt) => {
        const formData = new FormData()

        formData.append("_id", yogurt._id)
        formData.append("description", descriptionUpdate)
        formData.append("price", priceUpdate)
        formData.append("image", imgUrlUpdate)

        updateFunc(formData)
    }


    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const footerContentUpdate = (
        <div>
            <Button disabled={priceDisabledUpdate} label="עדכון" onClick={() => {
                setVisibleUpdate(false);
                handleUpdateClick(updateyogurt)
                setUpdateyogurt(null)
            }} autoFocus />
            <Button label="ביטול" onClick={() => {
                setPriceDisabledUpdate(false)
                setUpdateyogurt(null)
                setVisibleUpdate(false);
            }} className="p-button-text" />
        </div>
    );


    const [addFunc, { isError: isError_t }] = useAddItemMutation()
    const handleAddClick = () => {
        const formData = new FormData()

        formData.append("code", codeAdd)
        formData.append("category", "yogurt")
        formData.append("description", descriptionAdd)
        formData.append("price", priceAdd)
        formData.append("image", imgUrlAdd)

        addFunc(formData)
    }

    const [visibleAdd, setVisibleAdd] = useState(false);
    const footerContentAdd = (
        <div>
            <Button disabled={codeDisabled || priceDisabled} label="שמירה" onClick={() => {
                setVisibleAdd(false);
                setCodeDisabled(true)
                setPriceDisabled(true)
                handleAddClick()
            }} autoFocus />
            <Button label="ביטול" onClick={() => {
                setVisibleAdd(false);
                setCodeDisabled(true)
                setPriceDisabled(true)
            }} className="p-button-text" />
        </div>
    );

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'קוד תפוס', detail: 'הפריט לא נוסף', life: 3000 });
    }

    useEffect(() => {
        if (isError_t) {
            showError()
        }
    }, [isError_t])

    useEffect(() => {
        if (data) {
            setYogurts(data);
        }
    }, [data]);

    if (isLoading) {
        return <h1>Loading</h1>
    }
    if (isError) {
        return <h2>{error}</h2>
    }


    const listItem = (yogurts, index) => {
        return (
            <div className="col-12" key={yogurts.id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`http://localhost:8050/uploads/${yogurts?.image?.split("\\")[2]}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">קוד מוצר: {yogurts.code}</div>
                            <div className="text-2xl font-bold text-900">{yogurts.description}</div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{yogurts.price} ₪</span>
                            <Button onClick={() => { handleDeleteClick(yogurts) }} icon="pi pi-trash" rounded outlined aria-label="Filter" />
                            <Button icon="pi pi-pencil" rounded outlined aria-label="Filter" onClick={() => {
                                setVisibleUpdate(true);
                                setUpdateyogurt(yogurts);
                                setDescriptionUpdate(yogurts.description);
                                setPriceUpdate(yogurts.price);
                                setImgUrlUpdate(yogurts.imgUrl);
                            }} />

                            <Dialog header="עריכת יוגרט" visible={visibleUpdate} style={{ width: '50vw' }} onHide={() => setVisibleUpdate(false)} footer={footerContentUpdate}>
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

    const gridItem = (yogurts) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={yogurts.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`http://localhost:8050/uploads/${yogurts?.image?.split("\\")[2]}`} alt={yogurts.name} />
                        <div className="text-2xl font-bold text-900">קוד מוצר: {yogurts.code}</div>
                        <div className="gridDescription">{yogurts.description}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{yogurts.price} ₪</span>
                        <span className='icons'>
                            <Button onClick={() => { handleDeleteClick(yogurts) }} icon="pi pi-trash" rounded outlined aria-label="Filter" />
                            <Button icon="pi pi-pencil" rounded outlined aria-label="Filter" onClick={() => {
                                setVisibleUpdate(true);
                                setUpdateyogurt(yogurts);
                                setDescriptionUpdate(yogurts.description);
                                setPriceUpdate(yogurts.price);
                                setImgUrlUpdate(yogurts.imgUrl);
                            }} />

                            <Dialog header="עריכת יוגרט" visible={visibleUpdate} style={{ width: '50vw' }} onHide={() => setVisibleUpdate(false)} footer={footerContentUpdate}>
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

    const itemTemplate = (yogurts, layout, index) => {
        if (!yogurts) {
            return;
        }

        if (layout === 'list') return listItem(yogurts, index);
        else if (layout === 'grid') return gridItem(yogurts);
    };

    const listTemplate = (yogurtss, layout) => {
        return <div className="grid grid-nogutter">{yogurtss.map((yogurts, index) => itemTemplate(yogurts, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="headerManager">
                <Button className="buttonAdd" label="הוספת יוגרט" onClick={() => {
                    setVisibleAdd(true);
                    setCodeAdd("");
                    setDescriptionAdd("");
                    setPriceAdd("");
                    setImgUrlAdd("");
                }} />

                <Toast ref={toast} position='top-center' />
                <Dialog header="יוגרט" visible={visibleAdd} style={{ width: '50vw' }} onHide={() => setVisibleAdd(false)} footer={footerContentAdd}>
                    <p className="m-0">
                        <br />
                        <div className="dialogInput">
                            <span className="p-float-label">
                                <InputText
                                    keyfilter="int"
                                    value={codeAdd}
                                    onChange={(e) => {
                                        setCodeAdd(e.target.value)
                                        setCodeDisabled(!e.target.value.trim())
                                    }} />
                                <label htmlFor="קוד">קוד*</label>
                            </span>
                        </div>
                        <br />
                        <br />
                        <div className="dialogInput">
                            <span className="p-float-label">
                                <InputText keyfilter="int" value={priceAdd} onChange={(e) => {
                                    setPriceAdd(e.target.value)
                                    setPriceDisabled(!e.target.value.trim())
                                }} />
                                <label htmlFor="מחיר">מחיר*</label>
                            </span>
                        </div>
                        <br />
                        <br />
                        <div className="dialogInput">
                            <span className="p-float-label">
                                <InputTextarea value={descriptionAdd} onChange={(e) => setDescriptionAdd(e.target.value)} rows={4} cols={23} />
                                <label htmlFor="תיאור מוצר">תיאור מוצר</label>
                            </span>
                        </div>

                        <br />
                        <input type="file" name="image" onChange={handleAddImage} />
                    </p>
                </Dialog>

                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        <>

            <div>
                <DataView value={yogurts} listTemplate={listTemplate} layout={layout} header={header()} />
            </div>
        </>
    )
}

export default YogurtsM