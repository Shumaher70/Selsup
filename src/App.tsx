import { memo, useCallback, useState } from "react";

interface IParam {
  id: number;
  name: string;
  type: "string" | "number" | "select";
  options?: string[];
}

interface IParamValue {
  paramId: number;
  value: string | number;
}

interface IColor {
  id: number;
  name: string;
}

interface IModel {
  paramValues: IParamValue[];
  colors: IColor[];
}

interface IParamEditorProps {
  param: IParam;
  value: string | number;
  onChange: (id: number, value: string | number) => void;
}

// Компонент для редактирования одного параметра
const ParamEditor = memo(({ param, value, onChange }: IParamEditorProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // Преобразуем значение в нужный тип (строка или число)
    const newValue =
      param.type === "number" ? Number(e.target.value) : e.target.value;

    // Вызываем функцию изменения значения
    onChange(param.id, newValue);
  };

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={String(param.id)} className="mb-1 text-sm font-medium">
        {param.name}:
      </label>

      {param.type === "select" && param.options ? (
        <select
          id={String(param.id)}
          value={value || ""}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Выберите значение</option>
          {param.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={param.type === "number" ? "number" : "text"}
          id={String(param.id)}
          value={value || ""}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}
    </div>
  );
});

// Обновление значения параметра в модели
const updateParamValue = (
  prevModel: IModel,
  id: number,
  value: string | number,
): IModel => {
  // Ищем параметр, который нужно обновить
  const paramToUpdate = prevModel.paramValues.find((pv) => pv.paramId === id);

  // Если значение не изменилось, возвращаем текущую модель без изменений
  if (paramToUpdate?.value === value) {
    return prevModel;
  }

  // Создаем новую модель с обновленным значением
  return {
    ...prevModel,
    paramValues: prevModel.paramValues.map((pv) =>
      pv.paramId === id ? { ...pv, value } : pv,
    ),
  };
};

// Получение значения параметра по его ID
const getParamValue = (
  paramId: number,
  paramValues: IParamValue[],
): string | number => {
  const paramValue = paramValues.find((pv) => pv.paramId === paramId);
  return paramValue?.value || "";
};

interface ModelEditorProps {
  params: IParam[];
  model: IModel;
}

const ModelEditor = ({ params, model }: ModelEditorProps) => {
  const [currentModel, setCurrentModel] = useState<IModel>(() => {
    // Создаем копию модели с начальными значениями для всех параметров
    return {
      ...model,
      paramValues: params.map((param) => {
        const existingValue = model.paramValues.find(
          (pv) => pv.paramId === param.id,
        );
        return existingValue ?? { paramId: param.id, value: "" };
      }),
    };
  });

  // Функция для обновления значения параметра
  const handleParamChange = useCallback(
    (id: number, value: string | number) => {
      setCurrentModel((prevModel) => updateParamValue(prevModel, id, value));
    },
    [],
  );

  const getModel = () => {
    console.log("Текущая модель:", currentModel);
    return currentModel;
  };

  return (
    <div className="mx-auto max-w-md rounded-md bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        Редактирование параметров модели
      </h2>

      {params.map((param) => (
        <ParamEditor
          key={param.id}
          param={param}
          value={getParamValue(param.id, currentModel.paramValues)}
          onChange={handleParamChange}
        />
      ))}

      <button
        onClick={getModel}
        className="mt-6 rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition duration-300 hover:bg-blue-600"
      >
        Получить модель
      </button>
    </div>
  );
};

const App = () => {
  const params: IParam[] = [
    { id: 1, name: "Название товара", type: "string" },
    { id: 2, name: "Описание", type: "string" },
    { id: 3, name: "Производитель", type: "string" },
    { id: 4, name: "Цена", type: "number" },
    {
      id: 5,
      name: "Цвет",
      type: "select",
      options: ["Красный", "Синий", "Зеленый"],
    },
  ];

  const initialModel: IModel = {
    paramValues: [
      { paramId: 1, value: "Товар 1" },
      { paramId: 2, value: "" },
      { paramId: 3, value: "Производитель 1" },
      { paramId: 4, value: 100 },
      { paramId: 5, value: "Красный" },
    ],
    colors: [
      { id: 1, name: "Красный" },
      { id: 2, name: "Синий" },
    ],
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <ModelEditor params={params} model={initialModel} />
    </div>
  );
};

export default App;
