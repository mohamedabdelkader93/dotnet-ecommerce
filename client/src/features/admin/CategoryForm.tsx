import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../app/components/AppDropzone";
import AppSelectList from "../../app/components/AppSelectList";
import AppTextInput from "../../app/components/AppTextInput";
import useCategories from "../../app/hooks/useCategories";
import { Category } from "../../app/models/category";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from "./categoryValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setCategory } from "../categories/categoriesSlice";
import { LoadingButton } from "@mui/lab";

interface Props {
    category?: Category;
    cancelEdit: () => void;
}

export default function CategoryForm({ category, cancelEdit }: Props) {
    const { control, reset, handleSubmit, watch, formState: { isDirty, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const { categories } = useCategories();
    const watchFile = watch('file', null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (category && !watchFile && !isDirty) reset(category);
        return () => {
            if (watchFile) URL.revokeObjectURL(watchFile.preview);
        }
    }, [category, reset, watchFile, isDirty])

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: Category;
            if (category) {
                response = await agent.Admin.updateCategory(data);
            } else {
                response = await agent.Admin.createCategory(data);
            }
            dispatch(setCategory(response));
            cancelEdit();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                category Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name='name' label='Product name' />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <AppDropzone control={control} name='file' />
                            {watchFile ? (
                                <img src={watchFile.preview} alt="preview" style={{ maxHeight: 200 }} />
                            ) : (
                                <img src={category?.pictureUrl} alt={category?.name} style={{ maxHeight: 200 }} />
                            )}
                        </Box>

                    </Grid>
                </Grid>
                <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                    <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                    <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</LoadingButton>
                </Box>
            </form>
        </Box>
    )
}