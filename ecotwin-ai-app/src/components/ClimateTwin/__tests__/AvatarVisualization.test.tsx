import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AvatarVisualization } from '../AvatarVisualization';

describe('AvatarVisualization Component', () => {
  it('should fallback to default avatar on image load error', () => {
    render(
      <AvatarVisualization
        ecoLevel={1}
        ecoTitle="Seed Planter"
        progressPercent={50}
        nextLevel={2}
      />
    );

    const avatarImage = screen.getByAltText('Digital Climate Twin avatar — your environmental health visualised') as HTMLImageElement;
    expect(avatarImage.src).toContain('/climate-twin-avatar.png');

    // Trigger error
    fireEvent.error(avatarImage);

    // Verify fallback src is applied
    expect(avatarImage.src).toContain('/avatars/avatar-4.svg');
  });
});
