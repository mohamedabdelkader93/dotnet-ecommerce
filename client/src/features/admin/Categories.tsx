import { Edit, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import AppPagination from "../../app/components/AppPagination";
// import useProducts from "../../app/hooks/useProducts";
import { Category } from "../../app/models/category";
import { useAppDispatch } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { removeCategory, setPageNumber } from "../categories/categoriesSlice";
import ProductForm from "./ProductForm";
import useCategories from "../../app/hooks/useCategories";
import CategoryForm from "./CategoryForm";

export default function Inventory() {
    const {categories, metaData} = useCategories();
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [target, setTarget] = useState(0);

    function handleSelectCategory(category: Category) {
        setSelectedCategory(category);
        setEditMode(true);
    }

    function handleDeleteCategory(id: number) {
        setLoading(true);
        setTarget(id)
        agent.Admin.deleteCategory(id)
            .then(() => dispatch(removeCategory(id)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

    function cancelEdit() {
        if (selectedCategory) setSelectedCategory(undefined);
        setEditMode(false);
    }

    if (editMode) return <CategoryForm category={selectedCategory} cancelEdit={cancelEdit} />

    return (
        <>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Categories</Typography>
                <Button onClick={() => setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="left">Category</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow
                                key={category.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {category.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Box display='flex' alignItems='center'>
                                        <img src={category.pictureUrl} alt={category.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{category.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => handleSelectCategory(category)} startIcon={<Edit />} />
                                    <LoadingButton 
                                        loading={loading && target === category.id} 
                                        onClick={() => handleDeleteCategory(category.id)} 
                                        startIcon={<Delete />} color='error' />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData && 
                <Box sx={{pt: 2}}>
                    <AppPagination 
                        metaData={metaData} 
                        onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
                </Box>
            }
        </>
    )
}