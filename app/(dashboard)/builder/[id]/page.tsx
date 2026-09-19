import React from 'react'

import { getFormById } from '@/actions/form'

import FormBuilder from '@/components/FormBuilder'

const FormBuilderPage = async ({
    params
}:{
    params: { id: string }
}) => {

    const { id } = await params;
    const form = await getFormById(id);
    
  return (
    <FormBuilder form={form} />
  )
}

export default FormBuilderPage