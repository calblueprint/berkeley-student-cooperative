import Shiftcard  from './Shiftcard';
import { fireEvent, render } from "@testing-library/react";
import '@testing-library/jest-dom'
// import fetch from "node-fetch";

const makeSut = () => {
  return render(
      <Shiftcard/>
  );
};

describe("<DropdownList />", () => {
  test("Should not render dialog component on initial render", () => {
    const { container } = makeSut();

    expect(container.querySelector("Dialog")).not.toBeInTheDocument();
  });

  test("Should render ul component when click on button", () => {
    const { container, getByText } = makeSut();

    fireEvent.click(getByText("Create Shift"));

    expect(container.querySelector("Dialog")).toBeInTheDocument();
  });

//   test("Should switch button label on click", () => {
//     const { getByText } = makeSut({});

//     expect(getByText(labels.show)).toBeInTheDocument();

//     fireEvent.click(getByText(labels.show));

//     expect(getByText(labels.hide)).toBeInTheDocument();
//   });

//   test("Should render 3 li correctly", () => {
//     const { getByText, container } = makeSut({});

//     fireEvent.click(getByText(labels.show));

//     expect(container.querySelectorAll("li").length).toBe(data.length);
//   });

//   test("Should call onRemoveItem callback correctly", () => {
//     const onRemoveItem = jest.fn();

//     const { getByText, getAllByText } = makeSut({ onRemoveItem });

//     fireEvent.click(getByText(labels.show));

//     fireEvent.click(getAllByText(/Remove/)[2]);

//     expect(onRemoveItem).toHaveBeenCalledWith(data[2], 2);
//   });
});