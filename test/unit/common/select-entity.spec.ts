import selectEntity from '@/common/select-entity';
import inquirer from 'inquirer';

const choices = [
    {
        name: 'option 1',
        value: 'option 1'
    },
    {
        name: 'option 2',
        value: 'option 2'
    }];

describe('Select entity', () => {
    it('should return the selected entity name', async () => {
        jest.spyOn(inquirer, 'prompt').mockResolvedValue({
            selection: 'option 1'
        });

        const selection = await selectEntity('Test', choices);

        expect(selection).toEqual(['option 1']);
    });

    it('should return the selected entity names', async () => {
        jest.spyOn(inquirer, 'prompt').mockResolvedValue({
            selection: ['option 1', 'option 2']
        });

        const selection = await selectEntity('Test', choices, false);

        expect(selection).toEqual(['option 1', 'option 2']);
    });
});
