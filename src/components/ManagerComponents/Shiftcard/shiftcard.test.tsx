import Shiftcard from './Shiftcard'
import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// import fetch from "node-fetch";

const mockSetOpen = jest.fn()
const mockSetSent = jest.fn()

afterEach(() => {
  mockSetOpen.mockReset()
  mockSetSent.mockReset()
  cleanup()
})

describe('The shiftcard component', () => {
  test('Should have a Button with text "Add Shift"', () => {
    render(<Shiftcard />)
    // search for the element/component we want to verify (in this case it's a button)
    const shiftcardButton = screen.getByRole('button')
    expect(shiftcardButton.textContent).toEqual('Add Shift')
  })

  //   test('Should not render dialog component on initial render', () => {
  //     render(<Shiftcard />)
  //     // expect(container.querySelector('Dialog')).not.toBeInTheDocument()
  //   })

  test('Should set open to True on click of button', () => {
    render(<Shiftcard />)
    const shiftcardButton = screen.getByRole('button')
    shiftcardButton.click()
    expect(mockSetOpen).toHaveBeenCalledWith(true)

    // fireEvent.click(getByText('Create Shift'))

    // expect(container.querySelector('Dialog')).toBeInTheDocument()
  })

  test('Should set open to False on click of x', () => {
    render(<Shiftcard />)
    // how to distinguish bw diff buttons?
    const closeButton = screen.getAllByRole("button")[0];
    closeButton.click();
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  })

// example tests
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
})
