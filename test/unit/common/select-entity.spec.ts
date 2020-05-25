import selectEntity from '@/common/select-entity';
import inquirer from 'inquirer';

const choices = [
    {
        name: 'option 1',
        value: 'option 1'
    }
];

describe('Select entity', () => {
    it('should return the selected entity name', async () => {
        jest.spyOn(inquirer, 'prompt').mockResolvedValue({
            selection: 'option 1'
        });

        const selection = await selectEntity('Test', choices);

        expect(selection).toBe('option 1');
    });
});
