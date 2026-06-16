import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  it('should render title and children when open', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test ModalTitle">
        <div>Modal Children Content</div>
      </Modal>
    );

    expect(screen.getByText('Test ModalTitle')).toBeInTheDocument();
    expect(screen.getByText('Modal Children Content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={false} onClose={handleClose} title="Test ModalTitle">
        <div>Modal Children Content</div>
      </Modal>
    );

    expect(screen.queryByText('Test ModalTitle')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Children Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test ModalTitle">
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test ModalTitle">
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal open={true} onClose={handleClose} title="Test ModalTitle">
        <div>Content</div>
      </Modal>
    );

    const backdrop = container.firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should trap focus inside the modal when Tab is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test ModalTitle">
        <input data-testid="input-1" />
        <button data-testid="button-2">Action</button>
      </Modal>
    );

    const input1 = screen.getByTestId('input-1');
    const button2 = screen.getByTestId('button-2');

    const closeButton = screen.getByLabelText('Close dialog');

    // Focus starts at first focusable element
    input1.focus();
    expect(document.activeElement).toBe(input1);

    // Tab on last element should loop back to first (Close button)
    button2.focus();
    fireEvent.keyDown(button2, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(closeButton);

    // Shift+Tab on first element (Close button) should loop back to last (button2)
    closeButton.focus();
    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(button2);
  });
});
