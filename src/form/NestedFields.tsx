import { useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';

const NestedFields = () => {
  const [categories, setCategories] = useState([]);
  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext();
  const isAmount = watch('amount');

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const data = await response.json();
      setCategories(
        data.map((selectItem: { slug: string; name: string }) => ({
          label: selectItem.slug,
          value: selectItem.name,
        }))
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'witnesses',
  });

  return (
    <>
      <div>
        <label>Allocation</label>
        <Controller
          name="allocation"
          control={control}
          render={({ field }) => (
            <input type="number" {...field} disabled={!isAmount} />
          )}
        />
        {errors.allocation && <p>{errors.allocation.message}</p>}
      </div>

      <div>
        <label>Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select {...field}>
              {categories.map((category: { value: string; label: string }) => (
                <option key={category.value} value={category.value}>
                  {category?.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label>Witnesses</label>
        {fields.map((field, index) => (
          <div key={field.id}>
            <label>Name</label>
            <Controller
              render={({ field }) => <input {...field} />}
              name={`witnesses.${index}.name`}
              control={control}
            />
            <label>Email</label>
            <Controller
              render={({ field }) => <input {...field} />}
              name={`witnesses.${index}.email`}
              control={control}
            />
            <button onClick={() => remove(index)}>remove</button>
            {errors.witnesses?.[index]?.email && (
              <p>{errors.witnesses?.[index].email.message}</p>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', email: '' })}>
          Add Witness
        </button>
      </div>
    </>
  );
};

export default NestedFields;
