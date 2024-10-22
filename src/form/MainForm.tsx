import {
  useForm,
  Controller,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import NestedFields from './NestedFields';

type FormData = {
  amount?: number;
  allocation?: number;
  damagedParts?: string[];
  witnesses?: {
    email?: string;
  }[];
};

const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const schema = yup.object({
  amount: yup.number().min(0).max(300),
  allocation: yup.number().min(0).max(300),
  damagedParts: yup.array(),
  witnesses: yup
    .array()
    .of(
      yup.object({
        email: yup
          .string()
          .email()
          .test('uniqueEmail', 'Email exists.', async (value) => {
            if (!value) return false;
            const response = await fetch(
              `https://dummyjson.com/users/search?q=${value}`
            );
            const data = await response.json();
            return data?.users?.length === 0;
          }),
      })
    )
    .min(1, 'Add at least one witness.')
    .max(5, 'Max 5 witnesses.'),
});

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];

export const MainForm = () => {
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Amount</label>
          <Controller
            name="amount"
            control={methods.control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
              />
            )}
          />
          {errors.amount && <span role="alert">{errors.amount.message}</span>}
        </div>

        <div>
          <label>Damaged Parts</label>
          {damagedPartsOptions.map((option) => (
            <Controller
              key={option}
              name="damagedParts"
              control={methods.control}
              render={({ field }) => (
                <div>
                  <input
                    type="checkbox"
                    {...field}
                    checked={field?.value && field.value.includes(option)}
                    onChange={() =>
                      field.onChange(
                        field?.value && field.value.includes(option)
                          ? field.value.filter((p: string) => p !== option)
                          : [...field.value, option]
                      )
                    }
                  />
                  {option}
                </div>
              )}
            />
          ))}
          {errors.damagedParts && (
            <span role="alert">{errors.damagedParts.message}</span>
          )}
        </div>

        <NestedFields />

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default MainForm;
